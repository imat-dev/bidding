import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { AuthenticatedUser } from 'src/auth/strategy/auth.guard.jwt';
import { CurrentUser } from 'src/auth/strategy/current-user.decorator';
import { User } from 'src/auth/entity/user.entity';
import { ItemOwnerGuard } from './guards/item-owner.guard';
import { UpdateItemDto } from './dto/update-item.dto';
import { Status } from './entity/items.entity';

@Controller('items')
@UseGuards(AuthenticatedUser)
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
  constructor(private readonly itemService: ItemService) {}


  //Todo: pagination
  @Get() 
  async findAll(@Query('status') status : Status) {
    return await this.itemService.findAll(status);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createItemDto: CreateItemDto,
  ) {
    return await this.itemService.createBidItem(createItemDto, user);
  }

  @Patch(':itemId')
  @UseGuards(ItemOwnerGuard)
  async updateItemState(
    @Param('itemId') itemId: number,
    @Body() updateItemStateDto : UpdateItemDto,
  )  {

    console.log(updateItemStateDto.status)
    return await this.itemService.udpateBidStatus(updateItemStateDto.status, itemId);
  }
}
