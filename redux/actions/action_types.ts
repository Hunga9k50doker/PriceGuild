/**Begin Home type */
class _HomeTypeSagas {
  readonly latestCollection = "home-latest-collection-sagas";
  readonly popularPublishers = "home-popular-publishers-sagas";
  readonly browseHome = "browse-home-sagas";
}

class _HomeTypeReducer {
  readonly updateLatestCollection = "home-update-latest-collection-reducer";
  readonly updatePopularPublishers = "home-update-popular-publishers-reducer";
  readonly updateBrowseHome = "browse-home-sagas";
  readonly updateCardBreakDown= 'card-break-down-saga';
}

/***End Home type */
class _FilterTypeSagas {
  readonly getFilter = "get-filter";
}
class _FilterTypeReducer {
  readonly updateFilter = "update-filter";
}
class _ConfigTypeSagas {
  readonly getCurrencies = "get-Currencies";
}
class _ConfigTypeReducer {
  readonly updateCurrencies = "update-currencies";
  readonly updateSports = "update-sports";
  readonly updateIsBrowse = "update-is-browse"
  readonly updateUserNameSocial = "update-is-set-username"
  readonly updateEmailVerify = "update-is-email-verify"
  readonly updateIsShowCollection = "update-is-show-collection"
  readonly updateIsShowTabBar = "update-is-show-tab-bar"
}

/**Begin Category type */
class _CategoryReducer {
  readonly getValueDefault = "getValueDefault";
  readonly setValueDefault = "setValueDefault";
}
/**End Category type */

/**Begin Auth type */
class _AuthTypeSagas {
  readonly login = "auth-login-sagas";
  readonly register = "auth-register-sagas";
  readonly activeAccount = "auth-active-account-sagas";
  readonly logout = "logout-sagas";
}

class _AuthTypeReducer {
  readonly updateInfo = "auth-updateInfo-reducer";
  readonly logout = "auth-logout-success";
}
/**End Auth type */

class _MessageTypeSagas {
  readonly loadInboxAndSent = "pg_app_messages_load_inbox_and_sent";
  readonly getRealtimeConversations = "getRealtimeConversations";
  readonly sendMessage = "sendMessage";
  readonly removeMessage = "removeMessage";
}
class _MessageTypeReducer {
  readonly updateInboxAndSent = "update-inbox-and-sent";
  readonly updateConversations = "update-conversations";
}

class _CompareTypeSagas {}
class _CompareTypeReducer {
  readonly removeCard = "remove-card";
  readonly addCard = "add-card";
}
class _FriendTypeSagas {
  readonly getListFriend = "get-list-friend";
}

class _MaintenanceTypeSagas {
  readonly getListMaintenance = "get-list-maintenance"
}

class  _MaintenanceTypeReducer {
  readonly updateListMaintenance = "update-list-maintenance";
}
class  _SearchFilterTypeReducer {
  readonly updateSearchFilter = "update-search-filter";
  readonly isFilter = "is-filter";
  readonly updateSearchFilterTop100 = "update-search-filter-100";
  readonly isFilter100 = "is-filter-100";
  readonly isEdit = "is-edit";
}

class _FriendTypeReducer {
  readonly updateListFriend = "update-list-friend";
  // readonly updateFriends = "update-friends";
  // readonly updateFriendsRequests = "update-friends-requests";
  // readonly updateFriendBlock = "update-friend-block";
}

class _ClaimPhotopeReducer {
  readonly updateListId = "update-list-id";
}

class _Sagas {
  readonly authentication = new _AuthTypeSagas();
  readonly home = new _HomeTypeSagas();
  readonly filter = new _FilterTypeSagas();
  readonly config = new _ConfigTypeSagas();
  readonly message = new _MessageTypeSagas();
  readonly compare = new _CompareTypeSagas();
  readonly friend = new _FriendTypeSagas();
  readonly maintenance = new  _MaintenanceTypeSagas();
}

class _Reducer {
  /**Category type cho reducer */
  readonly category = new _CategoryReducer();
  readonly authentication = new _AuthTypeReducer();
  readonly home = new _HomeTypeReducer();
  readonly filter = new _FilterTypeReducer();
  readonly config = new _ConfigTypeReducer();
  readonly message = new _MessageTypeReducer();
  readonly compare = new _CompareTypeReducer();
  readonly friend = new _FriendTypeReducer();
  readonly claim = new _ClaimPhotopeReducer();
  readonly maintenance = new _MaintenanceTypeReducer();
  readonly search_filter = new  _SearchFilterTypeReducer();
}

export class ActionTypes {
  /**Chứa các type dispatch vào reducer */
  static readonly reducer: _Reducer = new _Reducer();
  static readonly sagas: _Sagas = new _Sagas();
}
