import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Channels } from './Channels';
import { DMs } from './DMs';
import { Mentions } from './Mentions';
import { WorkspaceMembers } from './WorkspaceMembers';
import { Workspaces } from './Workspaces';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'sleact', name: 'users' })
export class Users {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'email', unique: true, length: 30 })
    email: string;

    @Column('varchar', { name: 'nickname', length: 30 })
    nickname: string;

    @Column('varchar', { name: 'password', length: 100, select: false })
    password: string;

    // 생성할 때 자동으로 날짜를 넣어주는 컬럼
    @CreateDateColumn()
    createdAt: Date;

    // 수정할 때 자동으로 날짜를 넣어주는 컬럼
    @UpdateDateColumn()
    updatedAt: Date;

    // 삭제할 때 자동으로 날짜를 넣어주는 컬럼
    @DeleteDateColumn()
    // deletedAt을 사용해서 soft delete 방식(반대는 hard : row를 날림) 적용
    // 복원 가능성을 염두해두고
    // null : 아직 안지워짐, 
    // Date : 지운 날짜가 저장 즉, 가짜로 지움
    // find 할 때, deletedAt이 null인 애들만 가져와야 함.
    deletedAt: Date | null; 

    @OneToMany(() => ChannelChats, (channelchats) => channelchats.User)
    ChannelChats: ChannelChats[];

    @OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.User)
    ChannelMembers: ChannelMembers[];

    @OneToMany(() => DMs, (dms) => dms.Sender)
    DMs: DMs[];

    @OneToMany(() => DMs, (dms) => dms.Receiver)
    DMs2: DMs[];

    @OneToMany(() => Mentions, (mentions) => mentions.Sender)
    Mentions: Mentions[];

    @OneToMany(() => Mentions, (mentions) => mentions.Receiver)
    Mentions2: Mentions[];

    @OneToMany(
        () => WorkspaceMembers,
        (workspacemembers) => workspacemembers.User,
    )
    WorkspaceMembers: WorkspaceMembers[];

    @OneToMany(() => Workspaces, (workspaces) => workspaces.Owner)
    OwnedWorkspaces: Workspaces[];

    @ManyToMany(() => Workspaces, (workspaces) => workspaces.Members)
    @JoinTable({
        name: 'workspacemembers',
        joinColumn: {
        name: 'UserId',
        referencedColumnName: 'id',
        },
        inverseJoinColumn: {
        name: 'WorkspaceId',
        referencedColumnName: 'id',
        },
    })
    Workspaces: Workspaces[];

    @ManyToMany(() => Channels, (channels) => channels.Members)
    @JoinTable({
        name: 'channelmembers',
        joinColumn: {
        name: 'UserId',
        referencedColumnName: 'id',
        },
        inverseJoinColumn: {
        name: 'ChannelId',
        referencedColumnName: 'id',
        },
    })
    Channels: Channels[];
}
