import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import ReactScrollbar from "react-perfect-scrollbar"

import './styles.css'

import {Menu} from 'antd'
import ProfileCard from '../ProfileCard'
import Icon from '../Icon'
import Button from "../Button"

const SideNav = props => {

    const renderMenuItems = (menuItems) =>{
        return menuItems.map(({name, title, iconType, svg}) => {
            const path = `/${name}`;
            return (<Menu.Item key={path}>
                <NavLink exact to={path} activeClassName="selectedNavLink">
                    <div className='sidenav-root-menu-item'>
                        {iconType && <Icon type={iconType} size={26} svg={svg} title={title}/>}
                        <span className="item-title">
                            {title}
                        </span>
                    </div>
                </NavLink>
            </Menu.Item>);
        });
    };

        const {isShort, menuItems, name, avatar} = props;
        const rootClass = cn('sidenav-root', {'sidenav-root-short' : isShort});
        const menuClass = 'sidenav-root-menu' + (isShort ? '-short':'');
        const shouldScroll = window.innerHeight < 900;

        return (
            <div className={rootClass}>
                <div className="logo" onClick={props.onLogoClick}><span className="logo-img"></span></div>
                <ReactScrollbar
                    className="scrollableSideNav"
                    option={{suppressScrollX: true,
                        wheelPropagation: false}} >

                <div className='overwlow-a-y'>
                    <ProfileCard
                                 img={avatar}
                                 name={name}
                                 isShort={isShort}
                    />

                    <Menu
                        mode="inline"
                        className={menuClass}
                    >
                        {renderMenuItems(menuItems)}
                    </Menu>
                </div>
                </ReactScrollbar>
            </div>
        )

}

SideNav.propTypes = {};
SideNav.defaultProps = {};

export default SideNav;
