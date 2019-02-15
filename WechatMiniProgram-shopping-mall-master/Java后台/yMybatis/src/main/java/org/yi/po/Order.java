package org.yi.po;

import java.math.BigDecimal;

public class Order {
	Integer order_id;
	String good_name;
	BigDecimal good_price;
	String good_main_url;
	Integer good_num;

    public Integer getOrder_id() {
        return order_id;
    }

    public void setOrder_id(Integer order_id) {
        this.order_id = order_id;
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

    public Integer getGood_num() {
        return good_num;
    }

    public void setGood_num(Integer good_num) {
        this.good_num = good_num;
    }

    public Order(String goodName, BigDecimal goodPrice, String goodMainUrl, Integer goodNum) {
		super();
		this.good_name = goodName;
		this.good_price = goodPrice;
		this.good_main_url = goodMainUrl;
		this.good_num = goodNum;
	}
    public Order() {
        super();
    }
}
