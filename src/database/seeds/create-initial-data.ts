import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Channels } from "../../entities/Channels";
import { Workspaces } from "../../entities/Workspaces";

export class CreateInitialData implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        // Workspace 생성 seeding 작업
        await connection
            .createQueryBuilder()
            .insert()
            .into(Workspaces)
            .values([{ id: 1, name: 'Sleact', url: 'sleact' }])
            .execute();
        // Workspace 1번안에 일반 채널 생성
        await connection
            .createQueryBuilder()
            .insert()
            .into(Channels)
            .values([{ id: 1, name: '일반', private: false }])
            .execute();
    }
}