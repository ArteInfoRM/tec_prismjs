<?php
/**
 * 2007-2026 PrestaShop
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 *
 * @author    Tecnoacquisti.com
 * @copyright 2007-2026 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Tec_prismjs extends Module
{
    const CONFIG_OKAIDIA = 'TEC_PRISMJS_OKAIDIA';

    /**
     * @var bool
     */
    protected $config_form = false;

    /**
     * Tec_prismjs constructor.
     */
    public function __construct()
    {
        $this->name = 'tec_prismjs';
        $this->tab = 'content_management';
        $this->version = '1.1.0';
        $this->author = 'Tecnoacquisti.com';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Code and Prism.js integration');
        $this->description = $this->l('It highlights code snippets in blog posts and CMS pages with Prism.js.');
        $this->ps_versions_compliancy = ['min' => '1.7.8.0', 'max' => _PS_VERSION_];
    }

    /**
     * Install the module.
     *
     * @return bool
     */
    public function install()
    {
        Configuration::updateValue(self::CONFIG_OKAIDIA, false);

        return parent::install()
            && $this->registerHook('displayHeader')
            && $this->registerHook('displayBackOfficeHeader');
    }

    /**
     * Uninstall the module.
     *
     * @return bool
     */
    public function uninstall()
    {
        Configuration::deleteByName(self::CONFIG_OKAIDIA);

        return parent::uninstall();
    }

    /**
     * Render the module configuration page.
     *
     * @return string
     */
    public function getContent()
    {
        $output = '';

        if ((bool) Tools::isSubmit('submitTec_prismjsModule')) {
            $output .= $this->postProcess();
        }

        $this->context->smarty->assign('module_dir', $this->_path);

        $output .= $this->context->smarty->fetch($this->local_path . 'views/templates/admin/configure.tpl');
        $output .= $this->renderForm();
        $output .= $this->context->smarty->fetch($this->local_path . 'views/templates/admin/copyright.tpl');

        return $output;
    }

    /**
     * Build the configuration form.
     *
     * @return string
     */
    protected function renderForm()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = (int) $this->context->language->id;
        $helper->allow_employee_form_lang = (int) Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG');
        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitTec_prismjsModule';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            . '&configure=' . $this->name . '&tab_module=' . $this->tab . '&module_name=' . $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = [
            'fields_value' => $this->getConfigFormValues(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => (int) $this->context->language->id,
        ];

        return $helper->generateForm([$this->getConfigForm()]);
    }

    /**
     * Return the HelperForm structure.
     *
     * @return array
     */
    protected function getConfigForm()
    {
        return [
            'form' => [
                'legend' => [
                    'title' => $this->l('Settings'),
                    'icon' => 'icon-cogs',
                ],
                'input' => [
                    [
                        'type' => 'switch',
                        'label' => $this->l('Use Prism Okaidia'),
                        'name' => self::CONFIG_OKAIDIA,
                        'is_bool' => true,
                        'desc' => $this->l('Use the Prism dark theme.'),
                        'values' => [
                            [
                                'id' => 'active_on',
                                'value' => 1,
                                'label' => $this->l('Enabled'),
                            ],
                            [
                                'id' => 'active_off',
                                'value' => 0,
                                'label' => $this->l('Disabled'),
                            ],
                        ],
                    ],
                ],
                'submit' => [
                    'title' => $this->l('Save'),
                ],
            ],
        ];
    }

    /**
     * Return current configuration values.
     *
     * @return array
     */
    protected function getConfigFormValues()
    {
        return [
            self::CONFIG_OKAIDIA => (int) (bool) Configuration::get(self::CONFIG_OKAIDIA),
        ];
    }

    /**
     * Save submitted configuration values.
     *
     * @return string
     */
    protected function postProcess()
    {
        $useOkaidia = (string) Tools::getValue(self::CONFIG_OKAIDIA);

        if (!in_array($useOkaidia, ['0', '1'], true)) {
            return $this->displayError($this->l('Invalid configuration value.'));
        }

        Configuration::updateValue(self::CONFIG_OKAIDIA, (bool) (int) $useOkaidia);

        return $this->displayConfirmation($this->l('Settings updated.'));
    }

    /**
     * Load back-office assets on the module configuration page.
     *
     * @return void
     */
    public function hookDisplayBackOfficeHeader()
    {
        if (Tools::getValue('configure') === $this->name) {
            $this->context->controller->addCSS($this->_path . 'views/css/back.css');
        }
    }

    /**
     * Load front-office assets.
     *
     * @return void
     */
    public function hookDisplayHeader()
    {
        $theme = (bool) Configuration::get(self::CONFIG_OKAIDIA) ? 'prism-okaidia.min.css' : 'prism.min.css';

        $this->registerFrontStylesheet('tec-prismjs-theme', $this->_path . 'views/css/vendor/prism/' . $theme, 80);
        $this->registerFrontStylesheet('tec-prismjs-front', $this->_path . 'views/css/front.css', 90);
        $this->registerFrontJavascript('tec-prismjs-core', $this->_path . 'views/js/vendor/prism/prism.min.js', 80);
        $this->registerFrontJavascript('tec-prismjs-autoloader', $this->_path . 'views/js/vendor/prism/prism-autoloader.min.js', 90);
        $this->registerFrontJavascript('tec-prismjs-front', $this->_path . 'views/js/front.js', 100);
    }

    /**
     * Register a stylesheet with a legacy fallback.
     *
     * @param string $id Asset identifier
     * @param string $path Public asset path
     * @param int $priority Loading priority
     *
     * @return void
     */
    protected function registerFrontStylesheet($id, $path, $priority)
    {
        if (method_exists($this->context->controller, 'registerStylesheet')) {
            $this->context->controller->registerStylesheet(
                $id,
                $path,
                [
                    'media' => 'all',
                    'priority' => (int) $priority,
                ]
            );

            return;
        }

        $this->context->controller->addCSS($path, 'all');
    }

    /**
     * Register a JavaScript file with a legacy fallback.
     *
     * @param string $id Asset identifier
     * @param string $path Public asset path
     * @param int $priority Loading priority
     *
     * @return void
     */
    protected function registerFrontJavascript($id, $path, $priority)
    {
        if (method_exists($this->context->controller, 'registerJavascript')) {
            $this->context->controller->registerJavascript(
                $id,
                $path,
                [
                    'position' => 'bottom',
                    'priority' => (int) $priority,
                ]
            );

            return;
        }

        $this->context->controller->addJS($path);
    }
}
