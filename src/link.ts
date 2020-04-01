import { act } from "react-dom/test-utils";
import { ApolloLink, Operation, FetchResult } from "apollo-link";
import Observable, { ZenObservable } from "zen-observable-ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Result = Record<string, any>;

class MockLink extends ApolloLink {
  private requests: {
    operation: Operation;
    observer: ZenObservable.SubscriptionObserver<FetchResult>;
  }[] = [];

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      this.requests.push({ operation, observer });
    });
  }

  get pendingOperations(): Operation[] {
    return this.requests.map((request) => request.operation);
  }

  public findOperation(
    predicate: (operation: Operation) => boolean
  ): Operation {
    const operation = this.pendingOperations.find(predicate);

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
    const request = this.requests.pop();

    act(() => {
      if (!request) {
        throw new Error("MockLink: There are no pending operations");
      }

      const { operation, observer } = request;

      const data = typeof payload === "function" ? payload(operation) : payload;
      observer.next({ data });
      observer.complete();
    });
  }

  public rejectMostRecentOperation(
    payload: Error | ((operation: Operation) => Error)
  ): void {
    const request = this.requests.pop();

    act(() => {
      if (!request) {
        throw new Error("MockLink: There are no pending operations");
      }

      const { observer, operation } = request;

      const error =
        typeof payload === "function" ? payload(operation) : payload;
      observer.error(error);
      observer.complete();
    });
  }
}
export { MockLink };
