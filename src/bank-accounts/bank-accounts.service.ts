import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';

@Injectable()
export class BankAccountsService {

constructor(
  @InjectRepository(BankAccount)
  private repo: Repository<BankAccount>) {}

  async create(createBankAccountDto: CreateBankAccountDto) {
    const bankAccount = this.repo.create({
      account_number: createBankAccountDto.account_number,
      balance: 0
    });
    await this.repo.insert(bankAccount);
    return bankAccount;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({id});
  }

  async transfer(from: string, to: string, amount: number) {

    const fromAccount = await this.repo.findOneBy({account_number:from});
    const toAccount = await this.repo.findOneBy({account_number:to});

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    this.repo.save(fromAccount);
    this.repo.save(toAccount);
  }

  update(id: string, _updateBankAccountDto: UpdateBankAccountDto) {
    return `This action updates a #${id} bankAccount`;
  }

  remove(id: string) {
    return `This action removes a #${id} bankAccount`;
  }
}
