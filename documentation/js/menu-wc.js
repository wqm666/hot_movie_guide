'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">hot-movie-guide documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdminModule-3cd8698f536a3b4253560d317d5af66ccf8ffb483247f8dabe8a3cddb4424e313e02d1e48771056c0d8ab1b194c4d75402929a2572006426039f2dba191ca12d"' : 'data-bs-target="#xs-components-links-module-AdminModule-3cd8698f536a3b4253560d317d5af66ccf8ffb483247f8dabe8a3cddb4424e313e02d1e48771056c0d8ab1b194c4d75402929a2572006426039f2dba191ca12d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-3cd8698f536a3b4253560d317d5af66ccf8ffb483247f8dabe8a3cddb4424e313e02d1e48771056c0d8ab1b194c4d75402929a2572006426039f2dba191ca12d"' :
                                            'id="xs-components-links-module-AdminModule-3cd8698f536a3b4253560d317d5af66ccf8ffb483247f8dabe8a3cddb4424e313e02d1e48771056c0d8ab1b194c4d75402929a2572006426039f2dba191ca12d"' }>
                                            <li class="link">
                                                <a href="components/ManageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRoutingModule.html" data-type="entity-link" >AdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-26077cce485774c35b580e0e3bc8be63a1789c1c899c80204fe3a1eef62af70ffc9992e347beaeec7af28c4bfe661c6ffc473cf5298bac4932311b19582ee14e"' : 'data-bs-target="#xs-components-links-module-AppModule-26077cce485774c35b580e0e3bc8be63a1789c1c899c80204fe3a1eef62af70ffc9992e347beaeec7af28c4bfe661c6ffc473cf5298bac4932311b19582ee14e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-26077cce485774c35b580e0e3bc8be63a1789c1c899c80204fe3a1eef62af70ffc9992e347beaeec7af28c4bfe661c6ffc473cf5298bac4932311b19582ee14e"' :
                                            'id="xs-components-links-module-AppModule-26077cce485774c35b580e0e3bc8be63a1789c1c899c80204fe3a1eef62af70ffc9992e347beaeec7af28c4bfe661c6ffc473cf5298bac4932311b19582ee14e"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' : 'data-bs-target="#xs-components-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' :
                                            'id="xs-components-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' }>
                                            <li class="link">
                                                <a href="components/DetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FavoritesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FavoritesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QueryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserInfoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' :
                                        'id="xs-injectables-links-module-AuthModule-386e111deede5efe7d7c774ec81adfea69c241645e3ef645181b487ad1ac40e9c3baf1f7a6f53f46bdc084a9eb4baaf5ccc3feef84d102b6f2d262bbfca4687b"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthRoutingModule.html" data-type="entity-link" >AuthRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FavoritesService.html" data-type="entity-link" >FavoritesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MoviesService.html" data-type="entity-link" >MoviesService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Video.html" data-type="entity-link" >Video</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});