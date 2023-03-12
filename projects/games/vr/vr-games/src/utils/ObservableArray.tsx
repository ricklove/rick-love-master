/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-parameter-properties */
/* eslint-disable @typescript-eslint/typedef */
import { buffer, Subject } from 'rxjs';
import { logger } from './logger';

export class ObservableList<T> {
  public constructor(private _getItemKey: (item: T) => string, items: T[] = []) {
    items.forEach((x) => {
      this._map[this._getItemKey(x)] = x;
    });
    this._emit(true);
    // logger.log(`ObservableList constructor`, {
    //   items: this._frozenItems.length,
    //   map: Object.keys(this._map),
    // });
  }

  private readonly _emitter = new Subject<void>();
  private readonly _added = new Subject<T>();
  public readonly added = this._added.pipe(buffer(this._emitter));
  private readonly _removed = new Subject<T>();
  public readonly removed = this._removed.pipe(buffer(this._emitter));
  public readonly itemsSubject = new Subject<T[]>();

  private readonly _map: { [key: string]: T } = {};

  private _dirty = false;
  private _frozenItems = [] as T[];
  /** this will not change while frozen */
  public get items(): T[] {
    return this._frozenItems;
  }

  private _frozen = false;
  public get frozen() {
    return this._frozen;
  }
  public set frozen(value: boolean) {
    this._frozen = value;
    if (value) {
      return;
    }

    this._emit(false);
  }

  private _emit = (dirty = true) => {
    if (dirty) {
      this._dirty = true;
    }
    if (this._frozen) {
      return;
    }
    if (!this._dirty) {
      return;
    }
    this._dirty = false;
    this._frozenItems = Object.values(this._map);
    this._emitter.next();

    this.itemsSubject.next(this._frozenItems);
    logger.log(`ObservableList _emit`, {
      items: this._frozenItems.length,
      map: Object.keys(this._map),
    });
  };

  public add = (...items: T[]) => {
    items.forEach((x) => {
      const key = this._getItemKey(x);
      if (this._map[key]) {
        return;
      }
      this._map[key] = x;
      this._added.next(x);
    });
    this._emit();
  };
  public remove = (...items: T[]) => {
    items.forEach((x) => {
      const key = this._getItemKey(x);
      if (!this._map[key]) {
        return;
      }
      delete this._map[key];
      this._removed.next(x);
    });
    this._emit();
  };
}
