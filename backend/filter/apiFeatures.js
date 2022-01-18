class ApiFeatures{
    constructor(query,queryStr){    // query : to take data querystr: to send data
        this.query=query;
        this.queryStr=queryStr
    }

    // For search from navbar
    search(){
        const keyword=this.queryStr.keyword ?
        {
            product_name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            },
        }
        :{};
        this.query=this.query.find({...keyword});
        return this;
    }

    // filter of Sort by asscending and descending
    filter(){
        const queryCopy={...this.queryStr}
        const removeFields=["keyword","page","limit"];
        removeFields.forEach(key=>delete queryCopy[key])
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        this.query=this.query.find(JSON.parse(queryStr));
        return this;
    }

    // Pagination Part
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page)|| 1; // 50 -10
        const skip = resultPerPage *(currentPage-1) ;       
        this.query= this.query.limit(resultPerPage).skip(skip);      
        return this;
    }
};
export default ApiFeatures