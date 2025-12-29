import { BehaviorSubject, defer, filter, Observable } from 'rxjs';

export const loadOnce = <T>(load: () => Promise<T>): Observable<T> => {
  let subject: BehaviorSubject<undefined | T>;
  return defer(() => {
    if (!subject) {
      subject = new BehaviorSubject<undefined | T>(undefined);
      // eslint-disable-next-line no-void
      (async () => {
        try {
          const v = await load();
          subject.next(v);
        } catch (err) {
          subject.error(err);
        }
      })();
    }
    return subject.pipe(filter((x) => !!x)) as Observable<T>;
  });
};
