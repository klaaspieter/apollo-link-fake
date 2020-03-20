import { ApolloLink, Operation, FetchResult } from "apollo-link";
import Observable, { ZenObservable } from "zen-observable-ts";

class MockLink extends ApolloLink {
  private operations: ZenObservable.SubscriptionObserver<FetchResult>[] = [];

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable<FetchResult>(observer => {
      this.operations.push(observer);
    });
  }

  public resolveMostRecentOperation(data: Record<string, any>) {
    const subscription = this.operations.pop();
    subscription?.next(data);
    subscription?.complete();
  }
}
export { MockLink };
