export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    timezone: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    timezone?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    timezone?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            life_areas: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string | null;
                    icon: string | null;
                    color: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description?: string | null;
                    icon?: string | null;
                    color?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string | null;
                    icon?: string | null;
                    color?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            ledgers: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string | null;
                    color: string;
                    icon: string | null;
                    is_default: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description?: string | null;
                    color?: string;
                    icon?: string | null;
                    is_default?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string | null;
                    color?: string;
                    icon?: string | null;
                    is_default?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            ledger_entries: {
                Row: {
                    id: string;
                    user_id: string;
                    ledger_id: string;
                    life_area_id: string | null;
                    title: string;
                    content: string | null;
                    entry_date: string;
                    category: string | null;
                    related_goal_id: string | null;
                    metadata: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    ledger_id: string;
                    life_area_id?: string | null;
                    title: string;
                    content?: string | null;
                    entry_date?: string;
                    category?: string | null;
                    related_goal_id?: string | null;
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    ledger_id?: string;
                    life_area_id?: string | null;
                    title?: string;
                    content?: string | null;
                    entry_date?: string;
                    category?: string | null;
                    related_goal_id?: string | null;
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            goals: {
                Row: {
                    id: string;
                    user_id: string;
                    parent_goal_id: string | null;
                    title: string;
                    description: string | null;
                    goal_type: string;
                    period: string | null;
                    status: string;
                    start_date: string | null;
                    target_date: string | null;
                    progress: number;
                    life_area_id: string | null;
                    measurable_target: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    parent_goal_id?: string | null;
                    title: string;
                    description?: string | null;
                    goal_type?: string;
                    period?: string | null;
                    status?: string;
                    start_date?: string | null;
                    target_date?: string | null;
                    progress?: number;
                    life_area_id?: string | null;
                    measurable_target?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    parent_goal_id?: string | null;
                    title?: string;
                    description?: string | null;
                    goal_type?: string;
                    period?: string | null;
                    status?: string;
                    start_date?: string | null;
                    target_date?: string | null;
                    progress?: number;
                    life_area_id?: string | null;
                    measurable_target?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            tasks: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    description: string | null;
                    status: string;
                    priority: string;
                    due_date: string | null;
                    completed_at: string | null;
                    life_area_id: string | null;
                    goal_id: string | null;
                    time_window: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    description?: string | null;
                    status?: string;
                    priority?: string;
                    due_date?: string | null;
                    completed_at?: string | null;
                    life_area_id?: string | null;
                    goal_id?: string | null;
                    time_window?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    description?: string | null;
                    status?: string;
                    priority?: string;
                    due_date?: string | null;
                    completed_at?: string | null;
                    life_area_id?: string | null;
                    goal_id?: string | null;
                    time_window?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            deadlines: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    description: string | null;
                    due_at: string;
                    priority: string;
                    status: string;
                    life_area_id: string | null;
                    goal_id: string | null;
                    related_task_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    description?: string | null;
                    due_at: string;
                    priority?: string;
                    status?: string;
                    life_area_id?: string | null;
                    goal_id?: string | null;
                    related_task_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    description?: string | null;
                    due_at?: string;
                    priority?: string;
                    status?: string;
                    life_area_id?: string | null;
                    goal_id?: string | null;
                    related_task_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            planner_items: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    description: string | null;
                    day_of_week: string | null;
                    start_at: string | null;
                    end_at: string | null;
                    time_window: string | null;
                    item_type: string;
                    task_id: string | null;
                    goal_id: string | null;
                    life_area_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    description?: string | null;
                    day_of_week?: string | null;
                    start_at?: string | null;
                    end_at?: string | null;
                    time_window?: string | null;
                    item_type?: string;
                    task_id?: string | null;
                    goal_id?: string | null;
                    life_area_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    description?: string | null;
                    day_of_week?: string | null;
                    start_at?: string | null;
                    end_at?: string | null;
                    time_window?: string | null;
                    item_type?: string;
                    task_id?: string | null;
                    goal_id?: string | null;
                    life_area_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            decisions: {
                Row: {
                    id: string;
                    user_id: string;
                    life_area_id: string | null;
                    title: string;
                    situation: string;
                    options: Json;
                    chosen_option: string | null;
                    reason: string | null;
                    expected_outcome: string | null;
                    actual_outcome: string | null;
                    status: string;
                    decision_date: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    life_area_id?: string | null;
                    title: string;
                    situation: string;
                    options?: Json;
                    chosen_option?: string | null;
                    reason?: string | null;
                    expected_outcome?: string | null;
                    actual_outcome?: string | null;
                    status?: string;
                    decision_date?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    life_area_id?: string | null;
                    title?: string;
                    situation?: string;
                    options?: Json;
                    chosen_option?: string | null;
                    reason?: string | null;
                    expected_outcome?: string | null;
                    actual_outcome?: string | null;
                    status?: string;
                    decision_date?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            knowledge_items: {
                Row: {
                    id: string;
                    user_id: string;
                    life_area_id: string | null;
                    title: string;
                    content: string;
                    source_url: string | null;
                    category: string;
                    metadata: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    life_area_id?: string | null;
                    title: string;
                    content: string;
                    source_url?: string | null;
                    category?: string;
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    life_area_id?: string | null;
                    title?: string;
                    content?: string;
                    source_url?: string | null;
                    category?: string;
                    metadata?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            tags: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    created_at?: string;
                };
                Relationships: [];
            };
            task_tags: {
                Row: {
                    task_id: string;
                    tag_id: string;
                };
                Insert: {
                    task_id: string;
                    tag_id: string;
                };
                Update: {
                    task_id?: string;
                    tag_id?: string;
                };
                Relationships: [];
            };
            ledger_entry_tags: {
                Row: {
                    ledger_entry_id: string;
                    tag_id: string;
                };
                Insert: {
                    ledger_entry_id: string;
                    tag_id: string;
                };
                Update: {
                    ledger_entry_id?: string;
                    tag_id?: string;
                };
                Relationships: [];
            };
            ai_conversations: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            ai_messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    user_id: string;
                    role: string;
                    content: string;
                    metadata: Json;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    user_id: string;
                    role: string;
                    content: string;
                    metadata?: Json;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    conversation_id?: string;
                    user_id?: string;
                    role?: string;
                    content?: string;
                    metadata?: Json;
                    created_at?: string;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
