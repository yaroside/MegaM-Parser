const selectors = {
	allProducts: '.catalog-item-regular-desktop.ddl_product.catalog-item-desktop',
	productTitle: '.catalog-item-regular-desktop__title-link.ddl_product_link',
	productLink: '.catalog-item-regular-desktop__title-link.ddl_product_link',
	productPrice: '.catalog-item-regular-desktop__price',
	cbPercent: '.bonus-percent',
	cbAmount: '.bonus-amount',
}
const dom = {
	showMoreBtn:
		'.pui-button-element.pui-button-element_variant_secondary-medium.pui-button-element_size_lg',
	modalWindow: '.layout-onboarding__content',
	modalWindowClose:
		'.layout-onboarding__close.pui-icon.pui-icon_size_md.pui-icon_decolored',
}

export { selectors, dom }
