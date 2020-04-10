import { act } from "react-dom/test-utils";
import { ApolloLink, Operation, FetchResult } from "apollo-link";
import Observable, { ZenObservable } from "zen-observable-ts";

type Result = Record<string, unknown>;
export type Resolve = (result: Result) => void;
export type Reject = (error: Error) => void;

export interface PendingOperation extends Operation {
  resolve: Resolve;
  reject: Reject;
}

class MockLink extends ApolloLink {
  private _pendingOperations: PendingOperation[] = [];

  private createPendingOperation(
    operation: Operation,
    observer: ZenObservable.SubscriptionObserver<FetchResult>
  ): PendingOperation {
    const complete = (): void => {
      observer.complete();

      this._pendingOperations = this._pendingOperations.filter(
        (pending) => pending.toKey() !== operation.toKey()
      );
    };

    const resolve: Resolve = (result) => {
      observer.next({ data: result });
      complete();
    };

    const reject: Reject = (error: Error) => {
      observer.error(error);
      complete();
    };

    return { ...operation, toKey: operation.toKey, resolve, reject };
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      this.pendingOperations.push(
        this.createPendingOperation(operation, observer)
      );
    });
  }

  public get pendingOperations(): PendingOperation[] {
    return this._pendingOperations;
  }

  public get mostRecentOperation(): PendingOperation {
    if (this.pendingOperations.length <= 0) {
      throw new Error("MockLink: There are no pending operations");
    }

    return this.pendingOperations[0];
  }

  public findOperation(
    predicate: (operation: Operation) => boolean
  ): Operation {
    const operation = this.pendingOperations
      .map((pendingOperation) => pendingOperation)
      .find(predicate);

    if (operation === undefined) {
      throw new Error(
        "MockLink: Operation was not found in the list of pending operations"
      );
    }

    return operation;
  }

  public resolveMostRecentOperation(
    payload: Result | ((operation: Operation) => Result)
  ): void {
    const pendingOperation = this.pendingOperations.pop();

    act(() => {
      if (!pendingOperation) {
        throw new Error("MockLink: There are no pending operations");
      }

      const data =
        typeof payload === "function" ? payload(pendingOperation) : payload;
      pendingOperation.resolve(data);
    });
  }

  public rejectMostRecentOperation(
    payload: Error | ((operation: Operation) => Error)
  ): void {
    const pendingOperation = this.pendingOperations.pop();

    act(() => {
      if (!pendingOperation) {
        throw new Error("MockLink: There are no pending operations");
      }

      const error =
        typeof payload === "function" ? payload(pendingOperation) : payload;
      pendingOperation.reject(error);
    });
  }
}

export { MockLink };
