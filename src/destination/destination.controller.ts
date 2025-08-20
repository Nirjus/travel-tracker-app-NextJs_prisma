import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGaurd } from 'src/auth/jwt-auth.guard';
import { DestinationService } from './destination.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/updateDestination.dto';

// creating services
// get service
interface Requests extends Request {
  user: { userId: number };
}

@Controller('destination')
@UseGuards(JwtAuthGaurd)
export class DestinationController {
  constructor(private readonly destinationService: DestinationService) {}

  @Post()
  create(
    @Request()
    req: Requests,

    @Body()
    createDestinationDto: CreateDestinationDto,
  ) {
    return this.destinationService.create(
      req.user.userId,
      createDestinationDto,
    );
  }

  @Get()
  getAll(
    @Request()
    req: Requests,
  ) {
    return this.destinationService.findAll(req.user.userId);
  }

  @Get(':id')
  getOne(
    @Request()
    req: Requests,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.destinationService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Request()
    req: Requests,

    @Param('id')
    id: string,

    @Body()
    updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationService.update(
      req.user.userId,
      +id,
      updateDestinationDto,
    );
  }

  @Delete(':id')
  remove(
    @Request()
    req: Requests,

    @Param('id')
    id: string,
  ) {
    return this.destinationService.removeDestination(req.user.userId, +id);
  }
}
