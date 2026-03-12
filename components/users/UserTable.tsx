import type { User } from '../../types';
import Badge from '../ui/Badge';

type UserTableProps = {
  users: User[];
  onSelect: (user: User) => void;
};

const roleBadge = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return <Badge variant="purple">Admin</Badge>;
    case 'manager':
      return <Badge variant="blue">Manager</Badge>;
    case 'agent':
      return <Badge variant="green">Agent</Badge>;
    default:
      return <Badge variant="gray">Customer</Badge>;
  }
};

const statusBadge = (status: User['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="green">Active</Badge>;
    case 'suspended':
      return <Badge variant="yellow">Suspended</Badge>;
    default:
      return <Badge variant="red">Banned</Badge>;
  }
};

export default function UserTable({ users, onSelect }: UserTableProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-orange-100 pb-3 text-xs font-semibold uppercase text-slate-400">
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Permissions</span>
        <span>Actions</span>
      </div>
      {users.map((user) => (
        <button
          key={user._id}
          onClick={() => onSelect(user)}
          className="grid w-full grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center gap-4 rounded-2xl border border-orange-100 px-4 py-3 text-left text-sm hover:border-orange-200"
        >
          <span className="font-semibold text-slate-900">{user.name}</span>
          <span className="text-slate-500">{user.email}</span>
          {roleBadge(user.role)}
          {statusBadge(user.status)}
          <span className="text-slate-500">
            {user.permissions?.length ?? 0}
          </span>
          <span className="text-orange-500">View</span>
        </button>
      ))}
    </div>
  );
}
