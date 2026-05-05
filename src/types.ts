import type { ParcelWingErrorType } from "./errors";

export type NullablePrimitive = string | number | boolean | null;
export type JsonObject = Record<string, unknown>;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type ListResponse<T> = {
  object: "list";
  data: T[];
  pagination?: Pagination;
};

export type ResourceResponse<TObject extends string, TData> = {
  object: TObject;
  data: TData;
};

export type DeletionResponse<TObject extends string> = {
  object: TObject;
  id: string;
  deleted: true;
};

export type ApiErrorShape = {
  error: {
    type: ParcelWingErrorType;
    code?: string;
    message: string;
    details?: unknown;
    request_id?: string;
    [key: string]: unknown;
  };
};

export type ContactStatus =
  | "active"
  | "unsubscribed"
  | "bounced"
  | "spam_complaint"
  | "inactive";

export type Contact = {
  object: "contact";
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  attributes: Record<string, NullablePrimitive>;
  status: ContactStatus;
  source: string | null;
  external_id: string | null;
  metadata: JsonObject;
  created_at: string;
  updated_at: string;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
};

export type ContactCreateRequest = {
  email: string;
  first_name?: string;
  last_name?: string;
  attributes?: Record<string, NullablePrimitive>;
  status?: ContactStatus;
  external_id?: string;
  metadata?: JsonObject;
};

export type ContactUpdateRequest = Partial<ContactCreateRequest>;

export type ContactListParams = {
  page?: number;
  limit?: number;
  status?: ContactStatus;
  search?: string;
  external_id?: string;
  sort_by?: "created_at" | "updated_at" | "email" | "first_name" | "last_name";
  sort_order?: "asc" | "desc";
};

export type BatchCreateContactsResult = {
  object: "batch_result";
  data: {
    created: Contact[];
    failed: Array<{
      email: string;
      error: string;
      code: string;
    }>;
  };
};

export type SegmentFilterField =
  | "email"
  | "first_name"
  | "last_name"
  | "full_name"
  | "status"
  | "source"
  | "external_id"
  | "created_at"
  | "updated_at"
  | "subscribed_at"
  | "unsubscribed_at"
  | "attribute";

export type SegmentFilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "is_empty"
  | "is_not_empty"
  | "before"
  | "after"
  | "on_or_before"
  | "on_or_after";

export type SegmentFilterCondition = {
  id?: string;
  field: SegmentFilterField;
  operator: SegmentFilterOperator;
  value?: string | number | boolean;
  attribute_key?: string;
};

export type SegmentFilterCriteria = {
  version: 1;
  match: "all" | "any";
  conditions: SegmentFilterCondition[];
};

export type Segment = {
  object: "segment";
  id: string;
  name: string;
  description: string | null;
  filter_criteria: SegmentFilterCriteria;
  type: string | null;
  contact_count: number;
  is_active: boolean;
  metadata: JsonObject | null;
  created_at: string;
  updated_at: string;
};

export type SegmentCreateRequest = {
  name: string;
  description?: string;
  filter_criteria?: SegmentFilterCriteria;
  is_active?: boolean;
};

export type SegmentUpdateRequest = Partial<SegmentCreateRequest>;

export type SegmentListParams = {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  include_counts?: boolean;
  sort_by?: "created_at" | "updated_at" | "name";
  sort_order?: "asc" | "desc";
};

export type TopicDefaultSubscription = "opt_in" | "opt_out";
export type TopicVisibility = "public" | "private";

export type Topic = {
  object: "topic";
  id: string;
  name: string;
  description: string | null;
  default_subscription: TopicDefaultSubscription;
  visibility: TopicVisibility;
  is_active: boolean;
  subscriber_count: number;
  explicit_subscriber_count: number;
  explicit_unsubscriber_count: number;
  created_at: string;
  updated_at: string;
};

export type TopicCreateRequest = {
  name: string;
  description?: string;
  default_subscription?: TopicDefaultSubscription;
  visibility?: TopicVisibility;
  is_active?: boolean;
};

export type TopicUpdateRequest = Partial<
  Omit<TopicCreateRequest, "default_subscription">
>;

export type TopicListParams = {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  visibility?: TopicVisibility;
  sort_by?: "created_at" | "updated_at" | "name";
  sort_order?: "asc" | "desc";
};

export type EmailSendRequest = {
  from: string;
  to: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  reply_to?: string;
  tags?: Record<string, string>;
  template_id?: string;
  template_alias?: string;
  template_params?: Record<string, NullablePrimitive>;
};

export type QueuedEmail = {
  object: "email";
  id: string;
  to: string;
  status: "queued";
};

export type AutomationTrackRequest = {
  event_name: string;
  contact_id?: string | null;
  payload?: Record<string, unknown>;
  event_id?: string;
};

export type AutomationEvent = {
  object: "automation_event";
  event_id: string;
  event_name: string;
  contact_id: string | null;
  queued_runs: number;
};
