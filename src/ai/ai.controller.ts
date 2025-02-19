import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('query-database')
  async getDatabaseResults(
    @Query('model') model: string,
    @Query('query') query: string,
  ) {
    return this.aiService.queryDatabase(model, query);
  }

  @Get('analyze-trends')
  async getIndustryTrends(
    @Query('model') model: string,
    @Query('prompt') prompt: string,
  ) {
    return this.aiService.analyzeIndustryTrends(model, prompt);
  }

  @Get('search-web')
  async searchWeb(@Query('query') query: string) {
    return this.aiService.searchWeb(query);
  }
}
