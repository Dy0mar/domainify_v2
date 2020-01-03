import React from 'react'
import css from "./Preloader.module.css";
import Spin from "antd/es/spin";


const Preloader = (props) => {
    return (
        <div className={css.outer}>
            <Spin size="large" />
        </div>
    )
};

export default Preloader