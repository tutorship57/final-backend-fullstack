// user.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @Authorized('admin') // Only admins can manually create users
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @Authorized('admin', 'manager')
  findAll(@Query() filters, @Req() req) {
    // Passing user role and id from the JWT request
    return this.userService.findAll(filters, req.user.role, req.user.sub);
  }

  @Get(':id')
  // @Authorized('admin', 'user')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Patch(':id')
  // @Authorized('admin', 'user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Authorized('admin')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
