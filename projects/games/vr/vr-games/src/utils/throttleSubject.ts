import { BehaviorSubject, Observable, throttleTime } from 'rxjs';

export class ThrottleSubject<T> extends Observable<T> {
  private _inner: BehaviorSubject<T>;
  private _value: T;

  public constructor(value: T, throttleTimeMs: number = 1000) {
    super();
    this._inner = new BehaviorSubject<T>(value);
    this._value = value;
    this._inner.pipe(throttleTime(throttleTimeMs)).subscribe((x) => (this._value = x));
  }
  public get value() {
    return this._value;
  }
  public set value(v: T) {
    this._inner.next(v);
  }
}
