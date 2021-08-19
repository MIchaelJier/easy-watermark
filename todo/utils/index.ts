/*
 * @Description: 工具函数
 * @Version: 1.0.0
 * @Autor: michael_jier
 * @Date: 2021-08-19 10:14:08
 * @LastEditors: michael_jier
 * @LastEditTime: 2021-08-19 11:25:07
 */
/* eslint-disable no-undef */
import { IMAGETYPE } from '../types'
/**
 * @description: 获取图片的二进制流
 * @param {string} url
 * @return {Promise<string>}
 * @author: michael_jier
 */
export const getImageBlob = function (url: string): Promise<string> {
  return new Promise((reslove, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (xhr.status === 200) {
        reslove(URL.createObjectURL(this.response))
      }
    }
    xhr.onloadend = function () {
      if (xhr.status >= 400 && xhr.status < 500) {
        reject(xhr.status)
      }
    }
    xhr.send()
  })
}
/**
 * @description: img => base64
 * @param {HTMLImageElement} img
 * @return {string | undefined}
 * @author: michael_jier
 */
export const image2Base64 = function (
  img: HTMLImageElement
): string | undefined {
  if (!img) return
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  const dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

/**
 * @description: 获取图片对象/Base64
 * @param {string} src
 * @return {string} type
 * @author: michael_jier
 */
export const getImage = async function (
  src: string,
  type = IMAGETYPE.IMAGE
): Promise<HTMLImageElement | string | undefined> {
  const blob = await getImageBlob(src)
  return new Promise((reslove, reject) => {
    const image = new Image()
    image.src = blob
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = () => {
      reslove(type === IMAGETYPE.IMAGE ? image : image2Base64(image))
    }
    image.onerror = function (err) {
      reject(err)
    }
  })
}
