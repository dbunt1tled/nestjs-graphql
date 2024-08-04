import { Command, CommandRunner } from 'nest-commander';
import * as console from 'node:console';
import { UsersService } from 'src/modules/users/users.service';
import { UsersFilter } from 'src/modules/users/repository/users.filter';
import { HashService } from 'src/core/hash/hash.service';

@Command({
  name: 't:t',
  description: 'test function',
})
export class TestCommand extends CommandRunner {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
  ) {
    super();
  }

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const hash = await this.hashService.hash('Test');
    console.log(hash);
    console.log(await this.hashService.compare('Test', hash));
    // const u = await this.userService.one();
    // console.log(u);
    // const tokens = await this.hashService.tokens(u, {
    //   accessExpiredSec: 10,
    //   refreshExpiredSec: 20,
    // });
    // console.log(tokens);
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTkwZmUxYS04Nzk3LTdjY2QtYWNhNy0xZjQzZDkzYjcwMjIiLCJlbWFpbCI6InNpZG5pQGkudWEiLCJ0eXBlIjoiYWNjZXNzIiwic2Vzc2lvbiI6bnVsbCwiaWF0IjoxNzIyNTA4MDI1LCJleHAiOjE3MjI1MDgwMzV9.sJMxFyLv3HkvSmI0sOZXfz4K4N1ZvjbYf9D398k7_-w';
    console.log(await this.hashService.decode(token, false));
  }
}
