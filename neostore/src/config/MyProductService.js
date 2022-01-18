import axios from 'axios';
import { MAIN_URL } from './Url';

export function fetchProductService(keyword='',currentPage=1, price=[0,250000], sortdata,cate,fcolor){
    return axios.get(`${MAIN_URL}products/fetchProductService/${sortdata}/${cate}/${fcolor}?keyword=${keyword}&page=${currentPage}&product_cost[gte]=${price[0]}&&product_cost[lte]=${price[1]}`)
} 

export function getCatandCol(){
    return axios.get(`${MAIN_URL}products/getCatandCol`)
}

export function checkOutService(data){
    return axios.post(`${MAIN_URL}products/checkOutService`,data)
}

export function orderService(data){
    return axios.post(`${MAIN_URL}products/orderService`,data)
}

export function getPopularProducts(){
    return axios.get(`${MAIN_URL}products/getPopularProducts`)
}

export function rateProductService(data){
    return axios.post(`${MAIN_URL}products/rateProductService`,data)
}

export function fetchRateProduct(data){
    return axios.post(`${MAIN_URL}products/fetchRateProduct`,data)
}