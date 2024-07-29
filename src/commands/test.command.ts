import { Command, CommandRunner } from 'nest-commander';
import * as console from 'node:console';
import { UsersService } from 'src/users/users.service';
import { UsersFilter } from 'src/users/repository/users.filter';

@Command({
  name: 't:t',
  description: 'test function',
})
export class TestCommand extends CommandRunner {
  constructor(private readonly userService: UsersService) {
    super();
  }

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log(
      await this.userService.list(
        new UsersFilter({
          filter: {
            id: [
              '0190fe1a-8797-7ccd-aca7-1f43d93b7022',
              '01910048-b431-733f-9244-975dcbb9df99',
            ],
            emailFilter: 'sidni+',
            //emailFilter: ['sidni+', 'sid'],
          },
        }),
      ),
    );
  }
}
