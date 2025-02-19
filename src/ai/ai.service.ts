import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.schema';

@Injectable()
export class AiService {
  private chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
  private deepSeekApiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async queryAiModel(model: string, prompt: string): Promise<any> {
    const apiKey =
      model === 'chatgpt'
        ? this.configService.get<string>('OPENAI_API_KEY')
        : this.configService.get<string>('DEEPSEEK_API_KEY');

    const apiUrl =
      model === 'chatgpt' ? this.chatGptApiUrl : this.deepSeekApiUrl;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          apiUrl,
          { model: 'gpt-4', messages: [{ role: 'user', content: prompt }] },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // ✅ Extract AI response based on the provider
      let aiResponse;
      if (model === 'chatgpt') {
        aiResponse = response.data.choices[0]?.message?.content;
      } else if (model === 'deepseek') {
        aiResponse = response.data.result;
      } else {
        throw new Error('Invalid AI model.');
      }

      return aiResponse;
    } catch (error) {
      console.error('AI Query Error:', error);
      throw new HttpException(
        'AI Service Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async queryDatabase(
    model: string,
    naturalLanguageQuery: string,
  ): Promise<any> {
    try {
      // Step 1: Ask AI to generate a MongoDB query
      const aiResponse = await this.queryAiModel(
        model,
        `Convert this natural language request into a MongoDB JSON query: "${naturalLanguageQuery}". Ensure the output is ONLY valid JSON with NO extra text.`,
      );

      // Step 2: Parse AI-generated MongoDB query
      const mongoQuery = JSON.parse(aiResponse);

      // Step 3: Execute MongoDB query
      return await this.userModel.find(mongoQuery).exec();
    } catch (error) {
      console.error('Error processing AI-generated query:', error);
      throw new HttpException(
        'Invalid AI-generated MongoDB query.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async analyzeIndustryTrends(model: string, prompt: string): Promise<any> {
    try {
      const aiResponse = await this.queryAiModel(
        model,
        `Analyze the latest trends in ${prompt}. Provide key insights and future predictions.`,
      );

      return aiResponse;
    } catch (error) {
      console.error('Error analyzing industry trends:', error);
      throw new HttpException(
        'Industry Analysis Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchWeb(query: string): Promise<any> {
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${this.configService.get<string>('SERP_API_KEY')}`;

    const response = await firstValueFrom(this.httpService.get(searchUrl));
    return response.data;
  }
}
