interface WorkerNavigator {
  setAppBadge: (contents?: number) => Promise<void>;
  clearAppBadge: () => Promise<void>;
}
