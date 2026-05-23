export interface IssuesInterface {
    title: string,
    description: string,
    type: 'bug' | 'feature_request',
    status: 'open' | 'in_progress' | 'resolved',
    reporter_id: number,
}

export interface IssueRow extends IssuesInterface {
    id: number;
    created_at: string;
    updated_at: string;
}