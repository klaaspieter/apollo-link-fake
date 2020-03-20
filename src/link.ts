import { ApolloLink, Operation, Observable, FetchResult } from "apollo-link";

class MockLink extends ApolloLink {
  public request(operation: Operation): Observable<FetchResult> {
    return new Observable(observer => {
      const result: any = {
        user: {
          name: 'mock-value-for-field-"name"',
          age: 'mock-value-for-field-"age"'
        }
      };
      observer.next(result);
      observer.complete();
    });
  }
}
export { MockLink };
