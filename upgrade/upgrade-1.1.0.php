<?php
/**
 * 2009-2026 Tecnoacquisti.com
 *
 * @author    Tecnoacquisti.com
 * @copyright 2009-2026 Tecnoacquisti.com
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

/**
 * Upgrade module to version 1.1.0.
 *
 * @param Module $module Module instance
 *
 * @return bool
 */
function upgrade_module_1_1_0($module)
{
    Configuration::updateValue('TEC_PRISMJS_OKAIDIA', (bool) Configuration::get('TEC_PRISMJS_OKAIDIA'));
    $module->unregisterHook('displayFooterBefore');

    return $module->registerHook('displayHeader')
        && $module->registerHook('displayBackOfficeHeader');
}
