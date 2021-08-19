/* eslint-disable no-undef */
/*
 * @Description: WaterMark
 * @Version: 1.0.0
 * @Autor: michael_jier
 * @Date: 2021-08-19 10:13:03
 * @LastEditors: michael_jier
 * @LastEditTime: 2021-08-19 15:25:35
 */

import { fabric } from 'fabric'
import { WaterMarkOtps } from './types'
const MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver

class WaterMark {
  public opts: WaterMarkOtps
  public defaultOpts = {
    id: 'water-mark',
    paintList: [],
    zIndex: 999999,
  }
  private bodyObserver: MutationObserver | null = null
  private observer: MutationObserver | null = null

  constructor(userOpts: WaterMarkOtps) {
    this.opts = { ...this.defaultOpts, ...userOpts }

    this.createObserver()
    this.createCanvas()
    this.load()
  }

  // 获取otps里的
  private set(key: string, value: any): void {
    this.opts[key] = value
  }

  private get(key: string): any {
    return this.opts[key]
  }

  observe(): void {
    this.domObserve()
    this.bodyObserve()
  }

  domObserve(): void {
    if (!this.observer) return
    const dom = this.get('dom')
    this.observer.observe(dom, {
      childList: true,
      attributes: true,
      characterData: true,
    })
  }

  bodyObserve(): void {
    if (!this.bodyObserver) return
    const body = document.querySelector('body') as HTMLBodyElement
    this.bodyObserver.observe(body, {
      childList: true,
    })
  }

  createObserver(): void {
    this.createDomObserver()
    this.createBodyObserver()
  }

  createDomObserver(): void {
    this.observer = new MutationObserver(() => {
      this.remove()
    })
  }

  createBodyObserver(): void {
    this.bodyObserver = new MutationObserver((mutationList) => {
      // 水印删除
      if (
        mutationList[0].removedNodes.length &&
        (mutationList[0].removedNodes[0] as any)['id'] === this.get('id')
      ) {
        this.load()
      }
    })
  }

  createCanvas(): void {
    const canvas = new fabric.Canvas('canvas')
    const rect = new fabric.Rect({
      top: 50,
      left: 100,
      width: 100,
      height: 70,
      fill: 'red',
      stroke: 'orange',
      strokeWidth: 5,
      rx: 8,
      ry: 4,
    })
    canvas.add(rect)
    this.set('canvas', canvas)
  }

  remove(): void {
    const body = document.querySelector('body') as HTMLBodyElement
    const dom = this.get('dom')
    body.removeChild(dom)
    this.set('dom', null)
  }

  load(): void {
    const canvas = this.get('canvas')
    const img = canvas.toDataURL('image/png', 1.0)
    const body = document.querySelector('body')
    if (!body) return
    const dom = document.createElement('div')
    dom.setAttribute('id', this.get('id'))
    dom.setAttribute(
      'style',
      `
        background-image:url(${img}); 
        height: 100%; 
        position: fixed; 
        left: 0; 
        top: 0; 
        bottom: 0; 
        right: 0;
        pointer-events: none;
        z-index: ${this.get('zIndex')}
      `
    )
    this.set('dom', dom)
    body.appendChild(dom)
    this.observe()
  }
}

export default WaterMark
