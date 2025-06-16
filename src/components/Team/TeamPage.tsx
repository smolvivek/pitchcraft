import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, UserPlus, Mail, Phone, MoreVertical, Crown, Shield, User, Film, Edit, MessageSquare } from 'lucide-react';
import PremiumGate from '../PremiumGate';

const TeamPage: React.FC = () => {
  const { user } = useAuth();
  const [showInviteForm, setShowInviteForm] = useState(false);

  const collaborators = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@filmstudio.com',
      role: 'Co-Writer',
      avatar: 'SC',
      status: 'online',
      projectsShared: 3,
      lastActive: 'Active now'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      email: 'marcus@prodhouse.com',
      role: 'Producer',
      avatar: 'MR',
      status: 'away',
      projectsShared: 2,
      lastActive: '2 hours ago'
    },
    {
      id: '3',
      name: 'Emily Watson',
      email: 'emily@creativestudio.com',
      role: 'Script Editor',
      avatar: 'EW',
      status: 'online',
      projectsShared: 4,
      lastActive: 'Active now'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@indiefilms.com',
      role: 'Director',
      avatar: 'DK',
      status: 'offline',
      projectsShared: 1,
      lastActive: '1 day ago'
    }
  ];

  const sharedProjects = [
    {
      id: '1',
      title: 'Midnight in Tokyo',
      collaborators: ['Sarah Chen', 'Marcus Rodriguez'],
      lastUpdate: '2 hours ago',
      status: 'In Review'
    },
    {
      id: '2',
      title: 'The Last Lighthouse',
      collaborators: ['Emily Watson', 'David Kim'],
      lastUpdate: '1 day ago',
      status: 'Active'
    }
  ];

  const InviteForm = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Invite Collaborator</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="writer">Co-Writer</option>
            <option value="producer">Producer</option>
            <option value="director">Director</option>
            <option value="editor">Script Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Projects to Share</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Midnight in Tokyo</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">The Last Lighthouse</span>
            </label>
          </div>
        </div>
        <textarea
          placeholder="Personal message (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex space-x-3">
          <button
            onClick={() => setShowInviteForm(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'producer': return Crown;
      case 'director': return Shield;
      case 'co-writer': return Edit;
      case 'script editor': return MessageSquare;
      default: return User;
    }
  };

  const TeamContent = () => (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Collaborators</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{collaborators.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shared Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{sharedProjects.length}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Film className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online Now</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {collaborators.filter(c => c.status === 'online').length}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Invite Form */}
      {showInviteForm && <InviteForm />}

      {/* Collaborators */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Collaborators</h3>
            <button
              onClick={() => setShowInviteForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite Collaborator</span>
            </button>
          </div>
        </div>
        <div className="divide-y">
          {collaborators.map((collaborator) => {
            const RoleIcon = getRoleIcon(collaborator.role);
            return (
              <div key={collaborator.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{collaborator.avatar}</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}></div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{collaborator.name}</h4>
                        <RoleIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600">{collaborator.email}</p>
                      <p className="text-sm text-gray-500">{collaborator.role} • {collaborator.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{collaborator.projectsShared}</p>
                      <p className="text-xs text-gray-500">Shared Projects</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shared Projects */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Shared Projects</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {sharedProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Film className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-600">
                        Shared with: {project.collaborators.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {project.status}
                    </span>
                    <span className="text-sm text-gray-500">{project.lastUpdate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaboration Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Collaboration Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { user: 'Sarah Chen', action: 'added comments to', item: 'Midnight in Tokyo - Act II', time: '2 hours ago' },
              { user: 'Marcus Rodriguez', action: 'approved changes in', item: 'The Last Lighthouse - Character Bible', time: '4 hours ago' },
              { user: 'Emily Watson', action: 'suggested edits for', item: 'Quantum Hearts - Logline', time: '6 hours ago' },
              { user: 'David Kim', action: 'joined project', item: 'The Last Lighthouse', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collaboration</h1>
          <p className="text-gray-600 mt-1">Work together with writers, producers, and industry professionals</p>
        </div>
      </div>

      <PremiumGate feature="Team Collaboration & Real-time Editing">
        <TeamContent />
      </PremiumGate>
    </div>
  );
};

export default TeamPage;