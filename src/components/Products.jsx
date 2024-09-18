import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch(
        "https://product-data-2pdk.onrender.com/products"
      );
      const products = await response.json();

      if (componentMounted) {
        setData(products);
        setFilter(products); // Initially show all products
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  // Sorting Functions
  
  const sortProducts = (sortType) => {
    let sortedProducts = [...filter];
    switch (sortType) {
      case "lowToHigh":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "highToLow":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "aToZ":
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "zToA":
        sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        sortedProducts = [...data]; // Reset to default
        break;
    }
    setFilter(sortedProducts);
  };

  // Filtering based on search term
  useEffect(() => {
    if (searchTerm) {
      const filteredList = data.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilter(filteredList);
    } else {
      setFilter(data); // Reset to all products if search term is empty
    }
  }, [searchTerm, data]);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <Skeleton height={592} />
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (categoryName) => {
    const updatedList = data.filter(
      (item) => item.category?.name === categoryName
    );
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("sandbad")}
          >
            Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("Electronics")}
          >
            Electronics
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("Shoes")}
          >
            Shoes
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("Love is light")}
          >
            Furniture
          </button>
        </div>

        {/* Sorting Options */}
        <div className="sorting-options text-center mb-4">
          <button
            className="btn btn-sm btn-outline-secondary m-1"
            onClick={() => sortProducts("lowToHigh")}
          >
            Price: Low to High
          </button>
          <button
            className="btn btn-sm btn-outline-secondary m-1"
            onClick={() => sortProducts("highToLow")}
          >
            Price: High to Low
          </button>
          <button
            className="btn btn-sm btn-outline-secondary m-1"
            onClick={() => sortProducts("aToZ")}
          >
            A to Z
          </button>
          <button
            className="btn btn-sm btn-outline-secondary m-1"
            onClick={() => sortProducts("zToA")}
          >
            Z to A
          </button>
        </div>

        {/* Displaying Products */}
        <div className="row justify-content-center">
          {filter.map((product) => {
            return (
              <div
                id={product.id}
                key={product.id}
                className="col-md-3 col-sm-6 col-xs-8 col-12 mb-4"
              >
                <div className="card text-center h-100">
                  <img
                    className="card-img-top p-3"
                    src={product.images[0]}
                    alt={product.title}
                    height={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {product.title.substring(0, 12)}...
                    </h5>
                    <p className="card-text">
                      {product.description.substring(0, 90)}...
                    </p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">$ {product.price}</li>
                  </ul>
                  <div className="card-body">
                    <Link
                      to={"/product/" + product.id}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => {
                        toast.success("Added to cart");
                        addProduct(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>

        {/* Search Box */}

        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;



