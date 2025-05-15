import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { SubscriptionEntity } from './entities/subscription.entity';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    // Adicione outros campos do payload do JWT aqui, se houver
  };
}

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new subscription for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'The subscription has been successfully created.',
    type: SubscriptionEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.subscriptionService.create(createSubscriptionDto, userId);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all subscriptions (admin or for specific user if userId is queried)',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter subscriptions by user ID (admin/specific use cases)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions.',
    type: [SubscriptionEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.subscriptionService.findAllByUserId(userId);
    }
    // TODO: Implementar RBAC para proteger este endpoint se não houver userId
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific subscription by ID' })
  @ApiResponse({
    status: 200,
    description: 'The subscription details.',
    type: SubscriptionEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully updated.',
    type: SubscriptionEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully deleted.',
    type: SubscriptionEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionService.remove(id);
  }
}
