package org.yi.po;

import java.math.BigDecimal;

public class Cart {
	Integer cart_id;
	Integer good_id;
	String good_name;
	BigDecimal good_price;
	String good_main_url;
	String good_detail_urls;
	Integer selected;
	Integer num;

    public Integer getCart_id() {
        return cart_id;
    }

    public void setCart_id(Integer cart_id) {
        this.cart_id = cart_id;
    }

    public Integer getGood_id() {
        return good_id;
    }

    public void setGood_id(Integer good_id) {
        this.good_id = good_id;
    }

    public String getGood_name() {
        return good_name;
    }

    public void setGood_name(String good_name) {
        this.good_name = good_name;
    }

    public BigDecimal getGood_price() {
        return good_price;
    }

    public void setGood_price(BigDecimal good_price) {
        this.good_price = good_price;
    }

    public String getGood_main_url() {
        return good_main_url;
    }

    public void setGood_main_url(String good_main_url) {
        this.good_main_url = good_main_url;
    }

    public String getGood_detail_urls() {
        return good_detail_urls;
    }

    public void setGood_detail_urls(String good_detail_urls) {
        this.good_detail_urls = good_detail_urls;
    }

    public Integer getSelected() {
        return selected;
    }

    public void setSelected(Integer selected) {
        this.selected = selected;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }

    public Cart(Integer cartId, Integer goodId, String goodName, BigDecimal goodPrice, String goodMainUrl, String goodDetailUrls,
                Integer selected, Integer num) {
		super();
		this.cart_id = cartId;
		this.good_id = goodId;
		this.good_name = goodName;
		this.good_price = goodPrice;
		this.good_main_url = goodMainUrl;
		this.good_detail_urls=goodDetailUrls;
		this.selected = selected;
		this.num = num;
	}

	public Cart(Integer goodId, String goodName, BigDecimal goodPrice, String goodMainUrl,String goodDetailUrls) {
		super();
		this.good_id = goodId;
		this.good_name = goodName;
		this.good_price = goodPrice;
		this.good_main_url = goodMainUrl;
		this.good_detail_urls=goodDetailUrls;
	}
    public Cart() {
        super();
    }
	
}
