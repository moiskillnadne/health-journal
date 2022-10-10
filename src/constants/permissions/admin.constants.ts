export enum AdminUsersRoles {
  superAdmin = 'super_admin',
  contentManager = 'content_manager',
}

export enum AnalyticPermissions {
  canView = 'CAN_VIEW_ANALYTIC',
}

export enum TrackPermissions {
  canView = 'CAN_VIEW_TRACK',
  canCreate = 'CAN_CREATE_TRACK',
  canUpdate = 'CAN_UPDATE_TRACK',
  canDelete = 'CAN_DELETE_TRACK',
}

export enum ContentStoragePermissions {
  canView = 'CAN_VIEW_CONTENT_STORAGE',
  canUpload = 'CAN_UPLOAD_CONTENT_STORAGE',
  canDelete = 'CAN_UPLOAD_CONTENT_STORAGE',
}

export enum GalleryPermissions {
  canView = 'CAN_VIEW_CONTENT_GALLERY',
  canCreate = 'CAN_CREATE_CONTENT_GALLERY',
  canUpdate = 'CAN_UPDATE_CONTENT_GALLERY',
  canDelete = 'CAN_DELETE_CONTENT_GALLERY',
}

export enum CustomNotificationPermissions {
  canCreate = 'CAN_CREATE_CUSTOM_NOTIFICATION',
  canView = 'CAN_VIEW_CUSTOM_NOTIFICATION',
  canUpdate = 'CAN_UPDATE_CUSTOM_NOTIFICATION',
}

export enum PredefinedNotificationPermissions {
  canView = 'CAN_VIEW_PREDEFINED_NOTIFICATION',
  canUpdate = 'CAN_UPDATE_PREDEFINED_NOTIFICATION',
}

export enum AdminUsersPermissions {
  canView = 'CAN_VIEW_ADMIN_USER',
  canChangeStatus = 'CAN_CHANGE_STATUS_ADMIN_USER',
}

export enum AchievementPermissions {
  canView = 'CAN_VIEW_ACHIEVEMENT',
  canUpdate = 'CAN_UPDATE_ACHIEVEMENT',
  canChangeStatus = 'CAN_CHANGE_STATUS',
}

export type AdminUserPermissionsType =
  | AnalyticPermissions
  | TrackPermissions
  | ContentStoragePermissions
  | GalleryPermissions
  | CustomNotificationPermissions
  | PredefinedNotificationPermissions
  | AdminUsersPermissions
  | AchievementPermissions

const AdminUsersRolesPermissionsMap = {}
AdminUsersRolesPermissionsMap[AdminUsersRoles.superAdmin] = [
  AnalyticPermissions.canView,
  TrackPermissions.canView,
  TrackPermissions.canCreate,
  TrackPermissions.canUpdate,
  TrackPermissions.canDelete,
  ContentStoragePermissions.canView,
  ContentStoragePermissions.canUpload,
  ContentStoragePermissions.canDelete,
  GalleryPermissions.canView,
  GalleryPermissions.canCreate,
  GalleryPermissions.canUpdate,
  GalleryPermissions.canDelete,
  CustomNotificationPermissions.canCreate,
  CustomNotificationPermissions.canView,
  CustomNotificationPermissions.canUpdate,
  PredefinedNotificationPermissions.canView,
  PredefinedNotificationPermissions.canUpdate,
  AdminUsersPermissions.canView,
  AdminUsersPermissions.canChangeStatus,
  AchievementPermissions.canView,
  AchievementPermissions.canUpdate,
  AchievementPermissions.canChangeStatus,
]
AdminUsersRolesPermissionsMap[AdminUsersRoles.contentManager] = [
  TrackPermissions.canView,
  TrackPermissions.canCreate,
  TrackPermissions.canUpdate,
  ContentStoragePermissions.canView,
  ContentStoragePermissions.canUpload,
  GalleryPermissions.canView,
  GalleryPermissions.canCreate,
  GalleryPermissions.canUpdate,
  CustomNotificationPermissions.canView,
  PredefinedNotificationPermissions.canView,
  AchievementPermissions.canView,
]
export { AdminUsersRolesPermissionsMap }
