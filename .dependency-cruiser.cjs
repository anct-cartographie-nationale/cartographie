/** @type {import('dependency-cruiser').IConfiguration} */

const FORBIDDEN_GLOBAL = [
  {
    name: 'no-circular',
    severity: 'warn',
    comment:
      'This dependency is part of a circular relationship. You might want to revise ' +
      'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
    from: {},
    to: {
      circular: true
    }
  },
  {
    name: 'no-orphans',
    comment:
      "This is an orphan module - it's likely not used (anymore?). Either use it or " +
      "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
      'add an exception for it in your dependency-cruiser configuration. By default ' +
      'this rule does not scrutinize dot-files (e.g. .eslintrc.js), TypeScript declaration ' +
      'files (.d.ts), tsconfig.json and some of the babel and webpack configs.',
    severity: 'warn',
    from: {
      orphan: true,
      pathNot: [
        '(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$', // dot files
        '[.]d[.]ts$', // TypeScript declaration files
        '(^|/)tsconfig[.]json$', // TypeScript config
        '(^|/)(?:babel|webpack|vite)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$', // other configs
        '@[^/]+/default[.]tsx$', // Next.js parallel routes default files
        '[.]wc[.]tsx?$' // Web Components variants
      ]
    },
    to: {}
  },
  {
    name: 'no-deprecated-core',
    comment:
      'A module depends on a node core module that has been deprecated. Find an alternative - these are ' +
      "bound to exist - node doesn't deprecate lightly.",
    severity: 'warn',
    from: {},
    to: {
      dependencyTypes: ['core'],
      path: [
        '^v8/tools/codemap$',
        '^v8/tools/consarray$',
        '^v8/tools/csvparser$',
        '^v8/tools/logreader$',
        '^v8/tools/profile_view$',
        '^v8/tools/profile$',
        '^v8/tools/SourceMap$',
        '^v8/tools/splaytree$',
        '^v8/tools/tickprocessor-driver$',
        '^v8/tools/tickprocessor$',
        '^node-inspect/lib/_inspect$',
        '^node-inspect/lib/internal/inspect_client$',
        '^node-inspect/lib/internal/inspect_repl$',
        '^async_hooks$',
        '^punycode$',
        '^domain$',
        '^constants$',
        '^sys$',
        '^_linklist$',
        '^_stream_wrap$'
      ]
    }
  },
  {
    name: 'not-to-deprecated',
    comment:
      'This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later ' +
      'version of that module, or find an alternative. Deprecated modules are a security risk.',
    severity: 'warn',
    from: {},
    to: {
      dependencyTypes: ['deprecated']
    }
  },
  {
    name: 'no-non-package-json',
    severity: 'error',
    comment:
      "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. " +
      "That's problematic as the package either (1) won't be available on live (2 - worse) will be " +
      'available on live with an non-guaranteed version. Fix it by adding the package to the dependencies ' +
      'in your package.json.',
    from: {},
    to: {
      dependencyTypes: ['npm-no-pkg', 'npm-unknown']
    }
  },
  {
    name: 'not-to-unresolvable',
    comment:
      "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
      'module: add it to your package.json. In all other cases you likely already know what to do.',
    severity: 'error',
    from: {},
    to: {
      couldNotResolve: true
    }
  },
  {
    name: 'no-duplicate-dep-types',
    comment:
      "Likely this module depends on an external ('npm') package that occurs more than once " +
      'in your package.json i.e. bot as a devDependencies and in dependencies. This will cause ' +
      'maintenance problems later on.',
    severity: 'warn',
    from: {},
    to: {
      moreThanOneDependencyType: true,
      dependencyTypesNot: ['type-only']
    }
  },
  {
    name: 'not-to-spec',
    comment:
      'This module depends on a spec (test) file. The sole responsibility of a spec file is to test code. ' +
      "If there's something in a spec that's of use to other modules, it doesn't have that single " +
      'responsibility anymore. Factor it out into (e.g.) a separate utility/ helper or a mock.',
    severity: 'error',
    from: {},
    to: {
      path: '[.](?:spec|test|e2e|feature|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
    }
  },
  {
    name: 'not-to-dev-dep',
    severity: 'error',
    comment:
      "This module depends on an npm package from the 'devDependencies' section of your " +
      'package.json. It looks like something that ships to production, though. To prevent problems ' +
      "with npm packages that aren't there on production declare it (only!) in the 'dependencies'" +
      'section of your package.json. If this module is development only - add it to the ' +
      'from.pathNot re of the not-to-dev-dep rule in the dependency-cruiser configuration',
    from: {
      path: '^(src)',
      pathNot: ['[.](?:spec|test|e2e|feature|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$']
    },
    to: {
      dependencyTypes: ['npm-dev'],
      dependencyTypesNot: ['type-only'],
      pathNot: ['node_modules/@types/']
    }
  }
];

const FORBIDDEN_APP = [
  {
    name: 'no-interdependencies-in-app',
    comment:
      'Each file inside the `src/app` folder represents a primary entry point, such as a page or an API route. ' +
      'These entry points must remain isolated from one another. The only allowed dependencies are `src/features`, ' +
      'which host business capabilities, `src/libraries` for shared technical utilities, `src/external-api` for API clients, ' +
      'and global styles.',
    severity: 'error',
    from: {
      path: ['^src/app']
    },
    to: {
      pathNot: [
        'node_modules',
        '^src/libraries',
        '^src/features',
        '^src/shared',
        '^src/external-api',
        '^src/styles',
        '^src/app/metadata[.]ts$',
        'client[.]layout[.]tsx$',
        '^path$',
        '^fs$'
      ]
    }
  }
];

const FORBIDDEN_FEATURES = {
  GLOBAL: [
    {
      name: 'no-app-dependencies-in-features',
      comment:
        'Features represent self-contained, business-oriented capabilities. They must never depend on application code. ' +
        'The `src/app` folder defines framework-specific entry points, while `src/features` hosts the autonomous business capabilities.',
      severity: 'error',
      from: {
        path: ['^src/features']
      },
      to: {
        path: ['^src/app']
      }
    },
    {
      name: 'no-interdependencies-between-features',
      comment:
        'Features must never depend on other features. Each feature under `src/features` encapsulates its own domain, ' +
        'abilities, and supporting implementations, forming a fully autonomous unit of business capability.',
      severity: 'error',
      from: { path: '^src/features/([^/]+)/' },
      to: { path: '^src/features', pathNot: '^src/features/$1' }
    }
  ],
  ABILITIES: [
    {
      name: 'no-interdependencies-between-abilities',
      comment:
        'An ability represents a distinct, self-contained business behavior within a feature. ' +
        'Abilities must never depend on other abilities within the same feature, except for shared UI components.',
      severity: 'error',
      from: { path: 'src/features/([^/]+)/abilities/([^/]+)/' },
      to: {
        path: 'src/features/$1/abilities/',
        pathNot: ['src/features/$1/abilities/$2', 'src/features/$1/abilities/[^/]+/ui']
      }
    },
    {
      name: 'no-dependencies-between-ability-operations',
      comment:
        'Queries represent read operations of an ability. Each query must remain fully isolated. ' +
        'They can only depend on the feature domain, shared implementations, libraries, and their own validation schemas.',
      severity: 'error',
      from: {
        path: ['^src/features/([^/]+)/abilities/([^/]+)/query/'],
        pathNot: '[.](?:spec|test|e2e|feature|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
      },
      to: {
        pathNot: [
          '^src/features/$1/[^/]+[.]ts$',
          '^src/features/$1/domain',
          '^src/features/$1/keys',
          '^src/features/$1/injection',
          '^src/features/$1/implementations',
          '^src/features/$1/abilities/$2/query/',
          '^src/features/$1/abilities/$2/implementations/',
          '^src/libraries/',
          '^src/shared/',
          '^src/external-api/',
          '^node_modules/'
        ]
      }
    },
    {
      name: 'no-external-dependencies-in-ability-shared',
      comment:
        'Shared UI components within an ability can be imported by other abilities in the same feature, ' +
        'but they can only depend on their own ability, the feature domain, feature-level UI components, and shared libraries.',
      severity: 'error',
      from: {
        path: ['^src/features/([^/]+)/abilities/([^/]+)/ui/shared'],
        pathNot: '[.](?:spec|test|e2e|feature|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
      },
      to: {
        pathNot: [
          '^src/features/$1/abilities/$2/',
          '^src/features/$1/domain',
          '^src/features/$1/ui',
          '^src/libraries/',
          '^node_modules/'
        ]
      }
    },
    {
      name: 'no-external-dependencies-in-ability-ui',
      comment:
        "UI for an ability can depend on its own components, the feature's domain, shared libraries, " +
        'and shared UI components from other abilities within the same feature.',
      severity: 'error',
      from: {
        path: ['^src/features/([^/]+)/abilities/([^/]+)/ui'],
        pathNot: [
          '[.](?:spec|test|e2e|feature|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$',
          '^src/features/[^/]+/abilities/[^/]+/ui/shared'
        ]
      },
      to: {
        pathNot: [
          '^src/features/$1/abilities/$2/ui',
          '^src/features/$1/abilities/$2/query',
          '^src/features/$1/abilities/$2/presenter',
          '^src/features/$1/domain',
          '^src/features/$1/injection',
          '^src/features/$1/ui',
          '^src/libraries/',
          '^src/shared/',
          '^src/external-api/',
          '^node_modules/',
          '^src/features/$1/abilities/[^/]+/ui'
        ]
      }
    }
  ],
  DOMAIN: [
    {
      name: 'no-dependencies-in-domain',
      comment:
        'Domain code represents the core business concepts and rules of a feature. It is the pure model of the problem ' +
        'the feature solves. Domain code must be pure, fully self-contained and can only depend on itself or Zod for validation.',
      severity: 'error',
      from: {
        path: ['^src/features/([^/]+)/domain'],
        pathNot: '[.](?:spec|test|e2e|feature|stories)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
      },
      to: {
        pathNot: ['node_modules/.*zod', '^src/features/$1/domain', '^src/libraries/']
      }
    }
  ],
  IMPLEMENTATIONS: [
    {
      name: 'no-other-dependencies-than-domain-in-feature-implementations',
      comment:
        "Feature implementations provide concrete realizations of secondary adapters. They can only depend on the feature's domain, " +
        'npm packages, and external-api clients.',
      severity: 'error',
      from: {
        path: '^src/features/([^/]+)/implementations/',
        pathNot: 'index[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
      },
      to: {
        pathNot: [
          '^src/features/$1/domain',
          '^src/external-api/',
          '^src/libraries/',
          '^node_modules/'
        ]
      }
    }
  ],
  KEYS: [
    {
      name: 'no-other-dependencies-than-domain-in-feature-keys',
      comment:
        "Keys act as isolated pivots between a feature's domain contracts and their concrete implementations. " +
        "They serve as a dedicated layer for dependency inversion. Code under `src/features/<feature>/keys` can only depend on the feature's domain or piqure.",
      severity: 'error',
      from: {
        path: '^src/features/([^/]+)/keys',
        pathNot: 'index[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$'
      },
      to: {
        pathNot: ['^src/features/$1/domain', '^src/libraries/injection']
      }
    }
  ]
};

// Define allowed library dependencies graph
// Each library can only depend on libraries explicitly listed here
const LIBRARY_DEPENDENCIES = {
  ui: ['utils', 'injection', 'nextjs'],
  form: ['ui', 'utils'],
  reactivity: [],
  api: [],
  injection: [],
  analytics: ['injection'],
  nextjs: ['injection'],
  'inclusion-numerique-api': ['api', 'utils', 'collectivites', 'ban', 'injection'],
  collectivites: [],
  map: [],
  ban: []
};

// Generate interdependency rules for each library
const generateLibraryInterdependencyRules = () => {
  return Object.entries(LIBRARY_DEPENDENCIES).map(([lib, allowedDeps]) => ({
    name: `library-${lib}-allowed-deps`,
    comment: `Library '${lib}' can only depend on: ${allowedDeps.join(', ') || 'nothing'}`,
    severity: 'error',
    from: { path: `^src/libraries/${lib}/` },
    to: {
      path: '^src/libraries/',
      pathNot: [`^src/libraries/${lib}/`, ...allowedDeps.map((dep) => `^src/libraries/${dep}/`)]
    }
  }));
};

// Generate rule for libraries without declared dependencies
const generateStrictLibraryRule = () => ({
  name: 'no-undeclared-library-interdependencies',
  comment:
    'Libraries without declared dependencies cannot depend on other libraries. Add to LIBRARY_DEPENDENCIES if needed.',
  severity: 'error',
  from: {
    path: '^src/libraries/([^/]+)/',
    pathNot: Object.keys(LIBRARY_DEPENDENCIES).map((lib) => `^src/libraries/${lib}/`)
  },
  to: {
    path: '^src/libraries/',
    pathNot: ['^src/libraries/$1/']
  }
});

const FORBIDDEN_LIBRARIES = [
  {
    name: 'no-app-dependencies-in-libraries',
    comment: 'Libraries should never depend on app code.',
    severity: 'error',
    from: { path: ['^src/libraries'] },
    to: { path: ['^src/app'] }
  },
  {
    name: 'no-features-dependencies-in-libraries',
    comment: 'Libraries should not depend on features.',
    severity: 'error',
    from: {
      path: ['^src/libraries'],
      pathNot: ['[.](?:spec|test)[.](?:ts|tsx)$']
    },
    to: { path: ['^src/features'] }
  },
  ...generateLibraryInterdependencyRules(),
  generateStrictLibraryRule()
];

const FORBIDDEN_EXTERNAL_API = [
  {
    name: 'no-app-dependencies-in-external-api',
    comment: 'External API clients should never depend on app code.',
    severity: 'error',
    from: { path: ['^src/external-api'] },
    to: { path: ['^src/app'] }
  },
  {
    name: 'no-features-dependencies-in-external-api',
    comment: 'External API clients should not depend on features.',
    severity: 'error',
    from: { path: ['^src/external-api'] },
    to: { path: ['^src/features'] }
  }
];

const FORBIDDEN_WEB_COMPONENTS = [
  {
    name: 'web-components-allowed-dependencies',
    comment:
      'Web components can depend on features, libraries, external-api, and other web-components files, but not on app.',
    severity: 'error',
    from: { path: ['^src/web-components'] },
    to: {
      pathNot: [
        '^src/web-components',
        '^src/features',
        '^src/libraries',
        '^src/shared',
        '^src/external-api',
        '^src/styles',
        '^node_modules/'
      ]
    }
  }
];

module.exports = {
  forbidden: [
    ...FORBIDDEN_GLOBAL,
    ...FORBIDDEN_APP,
    ...FORBIDDEN_FEATURES.GLOBAL,
    ...FORBIDDEN_FEATURES.ABILITIES,
    ...FORBIDDEN_FEATURES.DOMAIN,
    ...FORBIDDEN_FEATURES.IMPLEMENTATIONS,
    ...FORBIDDEN_FEATURES.KEYS,
    ...FORBIDDEN_LIBRARIES,
    ...FORBIDDEN_EXTERNAL_API,
    ...FORBIDDEN_WEB_COMPONENTS
  ],
  options: {
    doNotFollow: {
      path: ['node_modules']
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['module', 'main', 'types', 'typings']
    },
    skipAnalysisNotInRules: true,
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)'
      },
      archi: {
        collapsePattern:
          '^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)'
      },
      text: {
        highlightFocused: true
      }
    }
  }
};
