import { Controller, Get, Post, Put, Param, Body, NotFoundException } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('api')
export class AppController {
  constructor(private readonly sessionService: SessionService) { }

  @Post('sessions')
  createSession(
    @Body() body: { language?: 'javascript' | 'python'; initialCode?: string },
  ) {
    const session = this.sessionService.createSession(undefined, body.language);
    return {
      sessionId: session.sessionId,
      createdAt: session.createdAt,
    };
  }

  @Get('sessions/:id')
  getSession(@Param('id') id: string) {
    const session = this.sessionService.getSession(id);
    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }
    return session;
  }

  @Get('sessions/:id/code')
  getCode(@Param('id') id: string) {
    const session = this.sessionService.getSession(id);
    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }
    return {
      code: session.code,
      language: session.language,
    };
  }

  @Put('sessions/:id/code')
  updateCode(
    @Param('id') id: string,
    @Body() body: { code: string; language?: 'javascript' | 'python' },
  ) {
    const session = this.sessionService.getSession(id);
    if (!session) {
      throw new NotFoundException(`Session ${id} not found`);
    }

    this.sessionService.updateCode(id, body.code);
    if (body.language) {
      this.sessionService.updateLanguage(id, body.language);
    }

    return { success: true };
  }
}
