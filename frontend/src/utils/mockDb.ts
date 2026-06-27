// ARVO AI-Native mock database and template engine.
// Saves local state to localStorage so the product flow is 100% demo-complete offline.

export interface SandboxProject {
  id: string;
  name: string;
  initialPrompt: string;
  created_at: string;
  appTemplate: 'calculator' | 'kanban' | 'chat';
  conversations: Array<{
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    terminalLogs?: string[];
  }>;
}

const TEMPLATES = {
  calculator: {
    name: 'SaaS Billing Calculator',
    description: 'Vite React billing preview tool with custom sliders and price simulations.'
  },
  kanban: {
    name: 'VisionOS Spatial Tasks',
    description: '3D board utilizing glassy cards and interactive drag overlays.'
  },
  chat: {
    name: 'Interactive AI Support Bot',
    description: 'Clean responsive chat dashboard featuring mock AI answers.'
  }
};

const getTemplateFromPrompt = (prompt: string): 'calculator' | 'kanban' | 'chat' => {
  const query = prompt.toLowerCase();
  if (query.includes('calc') || query.includes('billing') || query.includes('price') || query.includes('money')) {
    return 'calculator';
  }
  if (query.includes('task') || query.includes('kanban') || query.includes('board') || query.includes('todo')) {
    return 'kanban';
  }
  return 'chat';
};

const INITIAL_PROJECTS: SandboxProject[] = [];

const KEYS = {
  PROJECTS: 'arvo_ai_projects',
  TEMPORARY_PROMPT: 'arvo_captured_prompt',
  ACTIVE_PROJECT: 'arvo_active_project_id'
};

const getOrSet = <T>(key: string, initialData: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

const save = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockDb = {
  getProjects: (): SandboxProject[] => getOrSet(KEYS.PROJECTS, INITIAL_PROJECTS),
  
  getProject: (id: string): SandboxProject | undefined => {
    const list = mockDb.getProjects();
    return list.find(p => p.id === id);
  },

  createProjectFromPrompt: (prompt: string): SandboxProject => {
    const list = mockDb.getProjects();
    const templateType = getTemplateFromPrompt(prompt);
    const templateMeta = TEMPLATES[templateType];
    
    const newProject: SandboxProject = {
      id: `proj_${Date.now()}`,
      name: templateMeta.name,
      initialPrompt: prompt,
      created_at: new Date().toISOString(),
      appTemplate: templateType,
      conversations: [
        {
          id: `msg_init`,
          sender: 'assistant',
          text: `Initializing workspace for **${templateMeta.name}**... I am preparing the React, TypeScript and Tailwind compiler environments. Let's begin the initial layout rendering.`,
          timestamp: new Date().toISOString(),
          terminalLogs: [
            'arvo: initializing workspaces node v20.11.0',
            'arvo: resolving template modules...',
            'arvo: package.json verified successfully',
            'arvo: compiling tailwindcss classes...',
            'arvo: bundling source assets via Vite',
            'arvo: sandbox preview server listening on http://localhost:5173/'
          ]
        }
      ]
    };

    save(KEYS.PROJECTS, [...list, newProject]);
    localStorage.setItem(KEYS.ACTIVE_PROJECT, newProject.id);
    return newProject;
  },

  addMessageToProject: (
    projectId: string, 
    sender: 'user' | 'assistant', 
    text: string, 
    terminalLogs?: string[]
  ): SandboxProject => {
    const list = mockDb.getProjects();
    const idx = list.findIndex(p => p.id === projectId);
    if (idx === -1) throw new Error('Project not found');

    const project = list[idx];
    project.conversations.push({
      id: `msg_${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toISOString(),
      terminalLogs
    });

    list[idx] = project;
    save(KEYS.PROJECTS, list);
    return project;
  },

  setCapturedPrompt: (prompt: string): void => {
    localStorage.setItem(KEYS.TEMPORARY_PROMPT, prompt);
  },

  getCapturedPrompt: (): string | null => {
    return localStorage.getItem(KEYS.TEMPORARY_PROMPT);
  },

  clearCapturedPrompt: (): void => {
    localStorage.removeItem(KEYS.TEMPORARY_PROMPT);
  },

  getLastProject: (): SandboxProject | undefined => {
    const list = mockDb.getProjects();
    if (list.length === 0) return undefined;
    // Return the most recently created project
    return list[list.length - 1];
  },

  getOrCreateDefaultProject: (): SandboxProject => {
    const last = mockDb.getLastProject();
    if (last) return last;
    // No projects yet — create a default one
    return mockDb.createProjectFromPrompt('Interactive AI Support Bot');
  }
};
export default mockDb;
