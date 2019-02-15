package org.yi.po;


public class Category {
	Integer cat_id;
	String cat_name;
	String cat_type;
	String cat_banner;

    public Integer getCat_id() {
        return cat_id;
    }

    public void setCat_id(Integer cat_id) {
        this.cat_id = cat_id;
    }

    public String getCat_name() {
        return cat_name;
    }

    public void setCat_name(String cat_name) {
        this.cat_name = cat_name;
    }

    public String getCat_type() {
        return cat_type;
    }

    public void setCat_type(String cat_type) {
        this.cat_type = cat_type;
    }

    public String getCat_banner() {
        return cat_banner;
    }

    public void setCat_banner(String cat_banner) {
        this.cat_banner = cat_banner;
    }

    public Category(Integer catId, String catName, String catType, String catBanner) {
		super();
		this.cat_id = catId;
		this.cat_name = catName;
		this.cat_type = catType;
		this.cat_banner = catBanner;
	}
    public Category() {
        super();
    }

}
