const Error404 = ()=>{

return(
<div >
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          {/* <h1>404 Error Page</h1> */}
        </div>
        {/* <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active">404 Error Page</li>
          </ol>
        </div> */}
      </div>
    </div>
  </section>
  <section className="content">
    <div className="error-page">
      <h2 className="headline tss-heading"> 404</h2>
      <div className="error-content">
        <h3 className="tss-heading"><i className="fas fa-exclamation-triangle tss-heading" /> Oops! Page not found.</h3>
        <p className="tss-paragraph">
          We could not find the page you were looking for.
          Meanwhile, you may <a href="/master">return to dashboard.</a>
        </p>
       
      </div>
    </div>
  </section>
</div>


);
};

export default Error404;
