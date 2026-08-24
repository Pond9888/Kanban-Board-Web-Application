// @ts-nocheck
/**
 * Script to seed Supabase with the original dummy data.
 * To run: npx tsx --env-file=.env.local scripts/seed_supabase.ts
 */
import { supabase } from '../lib/supabase';

const initialCards = {
  'card-1': {
    id: 'card-1',
    title: 'Design new dashboard UI',
    description: 'Create a modern, intuitive dashboard layout with dark mode support. Focus on data visualization components and user experience improvements.',
    priority: 'high',
    assignees: ['Alice', 'Bob'],
    tags: ['design', 'ui/ux', 'frontend'],
    aiAgents: [
      { id: 'agent-1', name: 'UI Reviewer', type: 'reviewer', status: 'done', statusMessage: 'Review complete', result: 'Design looks great! Consider adding micro-animations for better UX.', assignedAt: Date.now() - 3600000 }
    ],
    columnId: 'todo', position: 0
  },
  'card-2': {
    id: 'card-2',
    title: 'Implement authentication system',
    description: 'Set up JWT-based authentication with refresh tokens, OAuth2 integration for Google/GitHub, and secure session management.',
    priority: 'critical', assignees: ['Charlie'], tags: ['backend', 'security', 'auth'],
    aiAgents: [{ id: 'agent-2', name: 'Security Analyst', type: 'researcher', status: 'thinking', statusMessage: 'Analyzing security requirements...', assignedAt: Date.now() - 1800000 }],
    columnId: 'todo', position: 1
  },
  'card-3': {
    id: 'card-3', title: 'API performance optimization', description: 'Profile and optimize slow API endpoints. Implement caching strategies, database query optimization, and load balancing.',
    priority: 'high', assignees: ['Diana', 'Eve'], tags: ['performance', 'backend', 'optimization'],
    aiAgents: [{ id: 'agent-3', name: 'Code Optimizer', type: 'coder', status: 'working', statusMessage: 'Writing optimized query patterns...', assignedAt: Date.now() - 900000 }],
    columnId: 'in-progress', position: 0
  },
  'card-4': {
    id: 'card-4', title: 'Write unit tests for payment module', description: 'Comprehensive test coverage for the payment processing module including edge cases, error handling, and integration tests.',
    priority: 'medium', assignees: ['Frank'], tags: ['testing', 'payments', 'quality'],
    aiAgents: [{ id: 'agent-4', name: 'Test Generator', type: 'tester', status: 'done', statusMessage: 'Tests generated', result: 'Generated 47 test cases covering happy paths and edge cases.', assignedAt: Date.now() - 7200000 }],
    columnId: 'in-progress', position: 1
  },
  'card-5': {
    id: 'card-5', title: 'Database schema migration', description: 'Migrate legacy database schema to new normalized structure. Ensure zero downtime deployment with rollback capability.',
    priority: 'critical', assignees: ['Grace', 'Henry'], tags: ['database', 'migration', 'backend'],
    aiAgents: [{ id: 'agent-5', name: 'DB Analyzer', type: 'reviewer', status: 'working', statusMessage: 'Reviewing migration scripts...', assignedAt: Date.now() - 600000 }],
    columnId: 'in-review', position: 0
  },
  'card-6': {
    id: 'card-6', title: 'Documentation update', description: 'Update API documentation, add code examples, and create getting started guides for new developers joining the project.',
    priority: 'low', assignees: ['Iris'], tags: ['docs', 'developer-experience'],
    aiAgents: [{ id: 'agent-6', name: 'Doc Writer', type: 'summarizer', status: 'idle', assignedAt: Date.now() - 14400000 }],
    columnId: 'in-review', position: 1
  },
  'card-7': {
    id: 'card-7', title: 'Deploy v2.0 to production', description: 'Successfully deployed version 2.0 with all new features including real-time collaboration, AI assistance, and performance improvements.',
    priority: 'high', assignees: ['Jack', 'Kate'], tags: ['deployment', 'production', 'release'],
    aiAgents: [{ id: 'agent-7', name: 'Deploy Checker', type: 'tester', status: 'done', statusMessage: 'All checks passed', result: 'Deployment successful. All health checks passing. 99.9% uptime maintained.', assignedAt: Date.now() - 28800000 }],
    columnId: 'done', position: 0
  },
  'card-8': {
    id: 'card-8', title: 'User feedback analysis', description: 'Analyzed 500+ user feedback submissions. Key insights: users want better mobile experience, faster load times, and more keyboard shortcuts.',
    priority: 'medium', assignees: ['Liam'], tags: ['research', 'ux', 'analytics'],
    aiAgents: [{ id: 'agent-8', name: 'Insight Extractor', type: 'researcher', status: 'done', statusMessage: 'Analysis complete', result: 'Top 3 requests: mobile optimization (68%), performance (54%), keyboard shortcuts (41%).', assignedAt: Date.now() - 57600000 }],
    columnId: 'done', position: 1
  }
};

async function seed() {
  const columns = [
    { id: 'todo', title: 'Todo', color: 'from-purple-500 to-indigo-500', position: 0 },
    { id: 'in-progress', title: 'In Progress', color: 'from-blue-500 to-cyan-500', position: 1 },
    { id: 'in-review', title: 'In Review', color: 'from-amber-500 to-orange-500', position: 2 },
    { id: 'done', title: 'Done', color: 'from-emerald-500 to-teal-500', position: 3 }
  ];

  const cardsToInsert = Object.values(initialCards).map(c => ({
    id: c.id, column_id: c.columnId, title: c.title, description: c.description,
    priority: c.priority, assignees: c.assignees, tags: c.tags, position: c.position,
  }));
  
  const agentsToInsert = Object.values(initialCards).flatMap(c => 
    c.aiAgents.map(a => ({
      id: a.id, card_id: c.id, name: a.name, type: a.type,
      status: a.status, status_message: a.statusMessage, result: a.result,
      assigned_at: new Date(a.assignedAt).toISOString()
    }))
  );

  console.log("Seeding Database...");
  await supabase.from('columns').upsert(columns);
  await supabase.from('cards').upsert(cardsToInsert);
  await supabase.from('ai_agents').upsert(agentsToInsert);
  console.log("Done seeding!");
}
seed();
