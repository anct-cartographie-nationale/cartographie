import { describe, expect, it } from 'vitest';
import { paginate } from './paginate';

describe('paginate', (): void => {
  it('has at least one page', (): void => {
    const { pages } = paginate({
      itemsCount: 0,
      pageSize: 0
    });

    expect(pages).toEqual([{ number: 1, isCurrent: true }]);
  });

  it('has at least one page even with invalid data', (): void => {
    const { pages } = paginate({
      itemsCount: -10,
      pageSize: -1
    });

    expect(pages).toEqual([{ number: 1, isCurrent: true }]);
  });

  it('has two pages', () => {
    const { pages } = paginate({
      itemsCount: 10,
      pageSize: 5
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false }
    ]);
  });

  it('has five pages', () => {
    const { pages } = paginate({
      itemsCount: 50,
      pageSize: 10
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false }
    ]);
  });

  it('has many page with current page set to 3', () => {
    const { pages } = paginate({
      itemsCount: 50,
      pageSize: 10,
      curentPage: 3
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: true },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false }
    ]);
  });

  it('sets current page to first page when current page is before first page', () => {
    const { pages } = paginate({
      itemsCount: 50,
      pageSize: 10,
      curentPage: -2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false }
    ]);
  });

  it('sets current page to last page when current page is after last page', () => {
    const { pages } = paginate({
      itemsCount: 50,
      pageSize: 10,
      curentPage: 7
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: true }
    ]);
  });

  it('limits current page to sibling count', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 20,
      siblingCount: 3
    });

    expect(pages).toEqual([
      { number: 17, isCurrent: false },
      { number: 18, isCurrent: false },
      { number: 19, isCurrent: false },
      { number: 20, isCurrent: true },
      { number: 21, isCurrent: false },
      { number: 22, isCurrent: false },
      { number: 23, isCurrent: false }
    ]);
  });

  it('with boundary count count set to 1', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 20,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 18, isCurrent: false },
      { number: 19, isCurrent: false },
      { number: 20, isCurrent: true },
      { number: 21, isCurrent: false },
      { number: 22, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary count count set to 2', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 20,
      siblingCount: 2,
      boundaryCount: 3
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 18, isCurrent: false },
      { number: 19, isCurrent: false },
      { number: 20, isCurrent: true },
      { number: 21, isCurrent: false },
      { number: 22, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 48, isCurrent: false },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 1, sibling count set to 2 and curent page set to 1', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 1,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 1, sibling count set to 2 and curent page set to 5', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 5,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: true },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 1, sibling count set to 2 and curent page set to 6', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 6,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: true },
      { number: 7, isCurrent: false },
      { number: 8, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 2 and curent page set to 1', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 1,
      siblingCount: 2,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: false },
      { number: 8, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 2 and curent page set to 6', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 6,
      siblingCount: 2,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: true },
      { number: 7, isCurrent: false },
      { number: 8, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 2 and curent page set to 7', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 7,
      siblingCount: 2,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: true },
      { number: 8, isCurrent: false },
      { number: 9, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 3 and curent page set to 1', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 1,
      siblingCount: 3,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: false },
      { number: 8, isCurrent: false },
      { number: 9, isCurrent: false },
      { number: 10, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 3 and curent page set to 7', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 7,
      siblingCount: 3,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: true },
      { number: 8, isCurrent: false },
      { number: 9, isCurrent: false },
      { number: 10, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 3 and curent page set to 8', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 8,
      siblingCount: 3,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: false },
      { number: 8, isCurrent: true },
      { number: 9, isCurrent: false },
      { number: 10, isCurrent: false },
      { number: 11, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 1, sibling count set to 2 and curent page set to 50', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 50,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: false },
      { number: 47, isCurrent: false },
      { number: 48, isCurrent: false },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: true }
    ]);
  });

  it('with boundary set to 1, sibling count set to 2 and curent page set to 46', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 46,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: true },
      { number: 47, isCurrent: false },
      { number: 48, isCurrent: false },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 1, sibling count set to 2 and curent page set to 45', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 45,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 43, isCurrent: false },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: true },
      { number: 46, isCurrent: false },
      { number: 47, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 2 and curent page set to 50', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 50,
      siblingCount: 2,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 43, isCurrent: false },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: false },
      { number: 47, isCurrent: false },
      { number: 48, isCurrent: false },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: true }
    ]);
  });

  it('with boundary set to 2, sibling count set to 2 and curent page set to 45', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 45,
      siblingCount: 2,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 43, isCurrent: false },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: true },
      { number: 46, isCurrent: false },
      { number: 47, isCurrent: false },
      { number: 48, isCurrent: false },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 2 and curent page set to 44', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 44,
      siblingCount: 2,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 42, isCurrent: false },
      { number: 43, isCurrent: false },
      { number: 44, isCurrent: true },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 3 and curent page set to 50', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 50,
      siblingCount: 3,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 41, isCurrent: false },
      { number: 42, isCurrent: false },
      { number: 43, isCurrent: false },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: false },
      { number: 47, isCurrent: false },
      { number: 48, isCurrent: false },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: true }
    ]);
  });

  it('with boundary set to 2, sibling count set to 3 and curent page set to 44', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 44,
      siblingCount: 3,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 41, isCurrent: false },
      { number: 42, isCurrent: false },
      { number: 43, isCurrent: false },
      { number: 44, isCurrent: true },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: false },
      { number: 47, isCurrent: false },
      { number: 48, isCurrent: false },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 3 and curent page set to 43', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 43,
      siblingCount: 3,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 40, isCurrent: false },
      { number: 41, isCurrent: false },
      { number: 42, isCurrent: false },
      { number: 43, isCurrent: true },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with boundary set to 2, sibling count set to 3 and curent page set to 43', () => {
    const { pages } = paginate({
      itemsCount: 500,
      pageSize: 10,
      curentPage: 43,
      siblingCount: 3,
      boundaryCount: 2
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: false },
      { spacer: 'spacer-start' },
      { number: 40, isCurrent: false },
      { number: 41, isCurrent: false },
      { number: 42, isCurrent: false },
      { number: 43, isCurrent: true },
      { number: 44, isCurrent: false },
      { number: 45, isCurrent: false },
      { number: 46, isCurrent: false },
      { spacer: 'spacer-end' },
      { number: 49, isCurrent: false },
      { number: 50, isCurrent: false }
    ]);
  });

  it('with start boundary larger than total page', () => {
    const { pages } = paginate({
      itemsCount: 140,
      pageSize: 25,
      curentPage: 1,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false }
    ]);
  });

  it('with start boundary is just one page less than total page', () => {
    const { pages } = paginate({
      itemsCount: 225,
      pageSize: 25,
      curentPage: 1,
      siblingCount: 2,
      boundaryCount: 1
    });

    expect(pages).toEqual([
      { number: 1, isCurrent: true },
      { number: 2, isCurrent: false },
      { number: 3, isCurrent: false },
      { number: 4, isCurrent: false },
      { number: 5, isCurrent: false },
      { number: 6, isCurrent: false },
      { number: 7, isCurrent: false },
      { number: 8, isCurrent: false },
      { number: 9, isCurrent: false }
    ]);
  });
});
