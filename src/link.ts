import { ApolloLink, Operation, FetchResult } from "apollo-link";
import Observable, { ZenObservable } from "zen-observable-ts";

class MockLink extends ApolloLink {
  private requests: {
    operation: Operation;
    observer: ZenObservable.SubscriptionObserver<FetchResult>;
  }[] = [];

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable<FetchResult>(observer => {
      this.requests.push({ operation, observer });
    });
  }

  public resolveMostRecentOperation(
    payload:
      | Record<string, any>
      | ((operation: Operation) => Record<string, any>)
  ) {
    const request = this.requests.pop();

    if (!request) {
      throw new Error("MockLink: There are no pending operations");
    }

    const { operation, observer } = request;

    const data = typeof payload === "function" ? payload(operation) : payload;
    observer.next({ data });
    observer.complete();
  }
}
export { MockLink };
