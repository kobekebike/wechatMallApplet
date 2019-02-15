package org.yi.po;

import java.io.Serializable;
import java.math.BigDecimal;

public class Good implements Serializable {
	Integer good_id;
	String good_name;
	BigDecimal good_price;
	String good_main_url;
	String good_detail_urls;
	String good_type;

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

    public String getGood_type() {
        return good_type;
    }

    public void setGood_type(String good_type) {
        this.good_type = good_type;
    }

    public Good(Integer goodId, String goodName, BigDecimal goodPrice,
                String goodType) {
		super();
		this.good_id = goodId;
		this.good_name = goodName;
		this.good_price = goodPrice;
		this.good_type = goodType;
	}

    public Good() {
        super();
    }

}
