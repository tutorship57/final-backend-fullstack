// user.controller.ts
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ForbiddenException,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Authorized } from 'src/auth/guards/authorized.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @Authorized('admin') // Only admins can manually create users
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Authorized('admin', 'company')
  findAll(@Query() filters: any, @Req() req: any) {
    return this.userService.findAll(filters, req.user.role, req.user.sub);
  }

  @Get(':id')
  @Authorized('admin', 'company', 'user')
  findOne(@Param('id') id: string, @Req() req: any) {
    // SECURITY: If role is 'user', ensure they are only looking at themselves
    if (req.user.role === 'user' && req.user.sub !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.userService.findOne({ id });
  }

  @Patch(':id')
  @Authorized('admin', 'user')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    if (req.user.role === 'user' && req.user.sub !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Authorized('admin') // Companies can delete their employees
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
