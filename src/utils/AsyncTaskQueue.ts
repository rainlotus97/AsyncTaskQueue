export class AsyncTaskQueue {
    private queue: (() => Promise<void>)[] = [];
    private isExecuting: boolean = false;
  
    enqueueTask(task: () => Promise<void>): void {
      this.queue.push(task);
      this.tryExecuteNextTask();
    }
  
    private async tryExecuteNextTask(): Promise<void> {
      if (!this.isExecuting && this.queue.length > 0) {
        const task = this.queue.shift();
        if (task) {
          this.isExecuting = true;
          try {
            await task();
          } finally {
            this.isExecuting = false;
            this.tryExecuteNextTask();
          }
        }
      }
    }
  }
  
  