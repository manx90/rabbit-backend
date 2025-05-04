import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // create
  async create(createUserDto: CreateUserDto) {
    const { role, ...user } = createUserDto;
    if (role === 'saler' || role === 'poster') {
      throw new Error('role user is not allowed');
    }
    return this.usersRepository.save(user);
  }

  //  findAll
  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  //  findOne
  async findOne(username: string): Promise<any> {
    return this.usersRepository.findOne({ where: { name: username } });
  }

  //  update
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { role, ...user } = updateUserDto;
    if (role === 'saler' || role === 'poster') {
      throw new Error('customer user is not allowed');
    }
    return this.usersRepository.update(id, user);
  }

  // delete
  async delete(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('user not found');
    }
    return this.usersRepository.delete(id);
  }
}
