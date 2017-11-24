const prefix = 'ZONE__';
export const NOOP = `${prefix}NOOP`;
export const REQUEST_LIST = `${prefix}REQUEST_LIST`;
export const RECEIVE_LIST = `${prefix}RECEIVE_LIST`;
export const RECEIVE_BREADCRUMB = `${prefix}RECEIVE_BREADCRUMB`;
export const RECEIVE_UNCOLLAPSED = `${prefix}RECEIVE_UNCOLLAPSED`;
export const RECEIVE_LIST_OBJECT = `${prefix}RECEIVE_LIST_OBJECT`;
export const REMOVE_LIST_OBJECT_ITEM = `${prefix}REMOVE_LIST_OBJECT_ITEM`;
export const RECEIVE_LIST_AND_PATCH = `${prefix}RECEIVE_LIST_AND_PATCH`;
export const RECEIVE_DEEP_ITEM = `${prefix}RECEIVE_DEEP_ITEM`;
export const RECEIVE_ERROR = `${prefix}RECEIVE_ERROR`;
export const RECEIVE_INFO = `${prefix}RECEIVE_INFO`;
export const SHOW_EDITOR = `${prefix}SHOW_EDITOR`;
export const FORM_DATA_CHANGED = `${prefix}FORM_DATA_CHANGED`;
export const REQUEST_ITEM = `${prefix}REQUEST_ITEM`;
export const SPINNER = `${prefix}SPINNER`;
export const ACTIVE_PAGE_CHANGED = `${prefix}ACTIVE_PAGE_CHANGED`;
export const SELECT_TREENODE = `${prefix}SELECT_TREENODE`;
export const SELECT_ZONE = `${prefix}SELECT_ZONE`;

export const parentIdKey = 'parent_zone_id';

export function getNodeId(data) {

  if (!data) {
    return 'zones';
  }

  const { id, parent_zone_id: parentId } = data;
/*
  if (parentId !== null) {
    return `zone-${parentId}-${id}`;
  }
*/  
  return `zone-${id}`;
}
