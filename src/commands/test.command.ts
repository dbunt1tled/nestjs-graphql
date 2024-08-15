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
      'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTkxMGY5My05MmVmLTc0NGEtODVhOS05ZTVlOGIzMTczZWYiLCJlbWFpbCI6InNpZG5pKzFAaS51YSIsInR5cGUiOiJhY2Nlc3MiLCJzZXNzaW9uIjoiZmIwY2ZhMTE5ZDcxY2Y4ODYzYzQ4NDBkZWRiYWQxN2EiLCJpYXQiOjE3MjM2NTA3NTksImV4cCI6MTcyMzY1Nzk1OX0.AEmOpLwQTSiqViK3MRc_FJHgTL2Q9GaILFGDlH0d1jjGnRJrQRVT5nl8ccTmH_Z9vbRKETnFFSXTFJJuO0LLj11HAa_xANIM4Wjsp2L8Qf0KpC0nfnoZWCxfBW7KKRExpViDBm_I1_XofKS4oYhwvni0EjOs8mU-A2kh9r5pOTJGNAG6';
    console.log(await this.hashService.decode(token, false));
  }
}
